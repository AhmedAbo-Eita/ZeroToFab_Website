/**
 * Client-side security utilities for the ZeroToFab Admin CMS and public media rendering:
 * - PBKDF2-SHA256 salted password hashing and constant-time verification via Web Crypto
 * - Environment-injected admin password hash resolution (`VITE_ADMIN_PASSWORD_HASH`)
 * - Session-scoped brute-force lockout cooldown & 30-minute idle session timeout
 * - Strict URL & raster-image data-URI sanitization (blocking `javascript:` and SVG scripts)
 */

const PBKDF2_ITERATIONS = 150_000;
const SALT_BYTES = 16;
const LOCKOUT_STORAGE_KEY = 'ztf_admin_lockout_v1';
const SESSION_STORAGE_KEY = 'ztf_admin_session_v1';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes idle timeout
const MAX_FAILED_ATTEMPTS = 5;
const BASE_LOCKOUT_MS = 30 * 1000; // 30s initial cooldown, doubles per threshold breach

const DISALLOWED_PASSWORDS = new Set(['admin123', 'password', '12345678']);

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Constant-time byte array comparison to avoid timing side-channels. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function derivePbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

/**
 * Generates a salted PBKDF2-SHA256 hash formatted as
 * `pbkdf2-sha256$<iterations>$<saltB64>$<hashB64>`.
 */
export async function hashAdminPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await derivePbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(derived)}`;
}

/** Verifies a plaintext password against a stored `pbkdf2-sha256$...` hash string. */
export async function verifyAdminPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256') {
    return false;
  }
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 10_000) {
    return false;
  }
  try {
    const salt = fromBase64(parts[2]);
    const expected = fromBase64(parts[3]);
    const actual = await derivePbkdf2(password, salt, iterations);
    return constantTimeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Returns the build-time `VITE_ADMIN_PASSWORD_HASH` if formatted validly, else `""`. */
export function getEnvAdminPasswordHash(): string {
  const raw = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  return typeof raw === 'string' && raw.startsWith('pbkdf2-sha256$')
    ? raw.trim()
    : '';
}

/** Validates minimum length and rejects common default passwords. Returns error text or `null`. */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (DISALLOWED_PASSWORDS.has(password)) {
    return 'Choose a stronger password (common defaults are not allowed).';
  }
  return null;
}

// --- Brute-Force Cooldown (stored in sessionStorage) ---

interface LockoutState {
  failures: number;
  lockedUntil: number;
}

function readLockoutState(): LockoutState {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) return { failures: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw) as Partial<LockoutState>;
    return {
      failures: typeof parsed.failures === 'number' ? parsed.failures : 0,
      lockedUntil: typeof parsed.lockedUntil === 'number' ? parsed.lockedUntil : 0,
    };
  } catch {
    return { failures: 0, lockedUntil: 0 };
  }
}

export function getLockoutRemainingMs(): number {
  const { lockedUntil } = readLockoutState();
  const rem = lockedUntil - Date.now();
  return rem > 0 ? rem : 0;
}

export function recordFailedUnlockAttempt(): {
  failures: number;
  lockedForMs: number;
} {
  const prev = readLockoutState();
  const failures = prev.failures + 1;
  let lockedUntil = 0;
  if (failures >= MAX_FAILED_ATTEMPTS) {
    const exponent = Math.min(failures - MAX_FAILED_ATTEMPTS, 4);
    lockedUntil = Date.now() + BASE_LOCKOUT_MS * Math.pow(2, exponent);
  }
  try {
    sessionStorage.setItem(
      LOCKOUT_STORAGE_KEY,
      JSON.stringify({ failures, lockedUntil })
    );
  } catch {
    // ignore
  }
  return {
    failures,
    lockedForMs: lockedUntil > Date.now() ? lockedUntil - Date.now() : 0,
  };
}

export function clearFailedUnlockAttempts(): void {
  try {
    sessionStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// --- Admin Unlock Session (idle-expiring in sessionStorage) ---

export function isAdminSessionActive(expectedHash: string): boolean {
  if (!expectedHash) return false;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { expiresAt?: number; hashTag?: string };
    const tag = expectedHash.slice(-16);
    if (parsed.hashTag !== tag) return false;
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function touchAdminSession(expectedHash: string): void {
  if (!expectedHash) return;
  try {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        expiresAt: Date.now() + SESSION_TTL_MS,
        hashTag: expectedHash.slice(-16),
      })
    );
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// --- URL & Media Sanitization ---

/** Allows only `http:` / `https:` URLs (and optional `#hash` anchors) to block `javascript:`/`data:` injection. */
export function sanitizeExternalUrl(
  raw: string | undefined | null,
  options: { allowRelativeHash?: boolean } = {}
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (options.allowRelativeHash && trimmed.startsWith('#')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/** Allows safe raster data URIs (`png`/`jpeg`/`webp`/`gif`), same-origin paths, or `http(s):` URLs. */
export function sanitizeImageSrc(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  // Allow safe raster data URLs (explicitly exclude SVG data URLs to prevent embedded scripts)
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-zA-Z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  // Allow same-origin relative paths (e.g. BASE_URL + favicon.svg)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  const safeHttp = sanitizeExternalUrl(trimmed);
  return safeHttp || undefined;
}
