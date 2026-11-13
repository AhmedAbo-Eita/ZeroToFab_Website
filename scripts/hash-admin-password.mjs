#!/usr/bin/env node
/**
 * CLI utility to generate a PBKDF2-SHA256 admin password hash compatible with
 * ZeroToFab's Web Crypto verifier (`src/utils/security.ts`).
 *
 * Usage:
 *   npm run hash-password
 *   npm run hash-password -- --password "YourStrongPassword"
 *
 * Output format:
 *   pbkdf2-sha256$150000$<base64-salt>$<base64-derived-key>
 */
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ITERATIONS = 150_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;
const DISALLOWED_PASSWORDS = new Set(['admin123', 'password', '12345678']);

/** Derives a 256-bit salted PBKDF2-SHA256 hash string. */
function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES);
  const derived = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_BYTES, 'sha256');
  return `pbkdf2-sha256$${ITERATIONS}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

/** Reads password from `--password <value>` CLI flag or interactive prompt. */
async function readPassword() {
  const argIdx = process.argv.indexOf('--password');
  if (argIdx !== -1 && process.argv[argIdx + 1]) {
    return process.argv[argIdx + 1];
  }
  const rl = readline.createInterface({ input, output });
  try {
    return await rl.question('Enter admin password (min 8 chars): ');
  } finally {
    rl.close();
  }
}

const pwd = await readPassword();
if (!pwd || pwd.length < 8) {
  console.error('Error: Password must be at least 8 characters long.');
  process.exit(1);
}
if (DISALLOWED_PASSWORDS.has(pwd)) {
  console.error('Error: Choose a stronger password (common defaults are not allowed).');
  process.exit(1);
}

const hash = hashPassword(pwd);
console.log('\nGenerated PBKDF2-SHA256 hash (safe to store in GitHub Secret VITE_ADMIN_PASSWORD_HASH):\n');
console.log(hash);
console.log('');
