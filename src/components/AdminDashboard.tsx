import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquareQuote,
  PlaySquare,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  CourseModule,
  FullSiteState,
  InstructorProfile,
  SiteSectionsConfig,
} from '../types/course';
import { BrandMark } from './BrandMark';
import { AdminCoursesPanel } from './admin/AdminCoursesPanel';
import { AdminSectionsPanel } from './admin/AdminSectionsPanel';
import { AdminExtrasPanel } from './admin/AdminExtrasPanel';
import {
  clearAdminSession,
  clearFailedUnlockAttempts,
  getEnvAdminPasswordHash,
  getLockoutRemainingMs,
  hashAdminPassword,
  isAdminSessionActive,
  recordFailedUnlockAttempt,
  sanitizeImageSrc,
  touchAdminSession,
  validatePasswordStrength,
  verifyAdminPassword,
} from '../utils/security';

interface AdminDashboardProps {
  state: FullSiteState;
  onUpdateState: (patch: Partial<FullSiteState>) => void;
  onResetDefaults: () => void;
  onGoToPublicSite: () => void;
}

type AdminTab =
  | 'courses'
  | 'sections'
  | 'masterclasses'
  | 'testimonials'
  | 'lab'
  | 'settings';

/**
 * Password-protected Admin CMS dashboard with:
 * 1. First-time PBKDF2-SHA256 password setup (when no local or env hash exists)
 * 2. Lock screen with brute-force backoff cooldown (5 attempts -> exponential lock)
 * 3. Idle-expiring session timer (30 min) and manual "Lock" control
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  state,
  onUpdateState,
  onResetDefaults,
  onGoToPublicSite,
}) => {
  // Prefer user-saved hash in localStorage; fall back to CI build-time secret hash
  const effectiveHash = state.security.passcodeHash || getEnvAdminPasswordHash();
  const [activeTab, setActiveTab] = useState<AdminTab>('courses');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (!state.security.passcodeEnabled) return true;
    return isAdminSessionActive(effectiveHash);
  });

  // Unlock form state
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [lockoutSec, setLockoutSec] = useState<number>(() =>
    Math.ceil(getLockoutRemainingMs() / 1000)
  );

  // First-time setup form state (when no password hash is configured yet)
  const [setupPass, setSetupPass] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);

  const notify = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Tick down brute-force lockout timer when locked
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const id = setInterval(() => {
      const rem = Math.ceil(getLockoutRemainingMs() / 1000);
      setLockoutSec(rem);
    }, 500);
    return () => clearInterval(id);
  }, [lockoutSec]);

  // Keep idle-timeout session alive on interaction & auto-lock when expired
  useEffect(() => {
    if (!state.security.passcodeEnabled || !unlocked || !effectiveHash) return;

    const refresh = () => touchAdminSession(effectiveHash);
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown'];
    events.forEach((ev) => window.addEventListener(ev, refresh, { passive: true }));

    const checker = setInterval(() => {
      if (!isAdminSessionActive(effectiveHash)) {
        setUnlocked(false);
        setPinInput('');
      }
    }, 15_000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, refresh));
      clearInterval(checker);
    };
  }, [state.security.passcodeEnabled, unlocked, effectiveHash]);

  const handleLockNow = () => {
    clearAdminSession();
    setUnlocked(false);
    setPinInput('');
    setPinError(null);
  };

  // First-time Admin Password Setup (no plaintext default password shipped)
  if (state.security.passcodeEnabled && !effectiveHash) {
    return (
      <div className="min-h-screen bg-[#141413] text-[#FAF9F5] flex items-center justify-center p-4 pcb-grid-bg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const strengthErr = validatePasswordStrength(setupPass);
            if (strengthErr) {
              setSetupError(strengthErr);
              return;
            }
            if (setupPass !== setupConfirm) {
              setSetupError('Passwords do not match.');
              return;
            }
            setVerifying(true);
            try {
              const hashed = await hashAdminPassword(setupPass);
              onUpdateState({
                security: {
                  passcodeEnabled: true,
                  passcodeHash: hashed,
                },
              });
              touchAdminSession(hashed);
              setUnlocked(true);
              setSetupPass('');
              setSetupConfirm('');
              setSetupError(null);
            } finally {
              setVerifying(false);
            }
          }}
          className="w-full max-w-md bg-[#FAF9F5] text-[#141413] border-[3px] border-[#141413] rounded-2xl p-8 shadow-[8px_8px_0px_#D97757] space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#D97757] border-2 border-[#141413] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Set Admin Password</h1>
              <p className="font-mono text-xs text-[#5C5A54]">
                First-time setup · Stored as PBKDF2-SHA256 hash
              </p>
            </div>
          </div>

          <p className="text-xs text-[#5C5A54] leading-relaxed bg-[#F0EEE6] p-3 rounded-lg border border-[#E8E6DC]">
            Protect your Admin CMS with a strong password (minimum 8 characters).
            Only a salted cryptographic hash is stored—never plaintext.
          </p>

          <div className="space-y-3">
            <input
              type="password"
              value={setupPass}
              onChange={(e) => setSetupPass(e.target.value)}
              placeholder="New admin password (min 8 chars)"
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg font-mono text-sm"
              autoFocus
            />
            <input
              type="password"
              value={setupConfirm}
              onChange={(e) => setSetupConfirm(e.target.value)}
              placeholder="Confirm admin password"
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg font-mono text-sm"
            />
          </div>

          {setupError && (
            <p className="text-xs font-bold text-red-700">{setupError}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onGoToPublicSite}
              className="px-4 py-2.5 border-2 border-[#141413] rounded font-bold text-xs cursor-pointer"
            >
              ← Back to Website
            </button>
            <button
              type="submit"
              disabled={verifying}
              className="brutal-btn px-6 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm cursor-pointer disabled:opacity-60"
            >
              {verifying ? 'Hashing...' : 'Save & Unlock'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!unlocked && state.security.passcodeEnabled) {
    return (
      <div className="min-h-screen bg-[#141413] text-[#FAF9F5] flex items-center justify-center p-4 pcb-grid-bg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const remMs = getLockoutRemainingMs();
            if (remMs > 0) {
              setLockoutSec(Math.ceil(remMs / 1000));
              return;
            }
            setVerifying(true);
            try {
              const ok = await verifyAdminPassword(pinInput, effectiveHash);
              if (ok) {
                clearFailedUnlockAttempts();
                touchAdminSession(effectiveHash);
                setUnlocked(true);
                setPinInput('');
                setPinError(null);
              } else {
                const { failures, lockedForMs } = recordFailedUnlockAttempt();
                if (lockedForMs > 0) {
                  setLockoutSec(Math.ceil(lockedForMs / 1000));
                  setPinError(
                    `Too many failed attempts. Locked for ${Math.ceil(lockedForMs / 1000)}s.`
                  );
                } else {
                  setPinError(
                    `Incorrect password (attempt ${failures}/5 before cooldown).`
                  );
                }
              }
            } finally {
              setVerifying(false);
            }
          }}
          className="w-full max-w-md bg-[#FAF9F5] text-[#141413] border-[3px] border-[#141413] rounded-2xl p-8 shadow-[8px_8px_0px_#D97757] space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#D97757] border-2 border-[#141413] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Admin Dashboard Locked</h1>
              <p className="font-mono text-xs text-[#5C5A54]">
                Enter your admin password
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
              disabled={lockoutSec > 0}
              className="w-full px-4 py-3 pr-11 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg font-mono text-sm disabled:opacity-60"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin((s) => !s)}
              aria-label={showPin ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5A54] hover:text-[#141413] cursor-pointer"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {lockoutSec > 0 ? (
            <p className="text-xs font-bold text-red-700 font-mono">
              Too many failed attempts. Retry in {lockoutSec}s.
            </p>
          ) : (
            pinError && <p className="text-xs font-bold text-red-700">{pinError}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onGoToPublicSite}
              className="px-4 py-2.5 border-2 border-[#141413] rounded font-bold text-xs cursor-pointer"
            >
              ← Back to Website
            </button>
            <button
              type="submit"
              disabled={verifying || lockoutSec > 0}
              className="brutal-btn px-6 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm cursor-pointer disabled:opacity-60"
            >
              {verifying ? 'Verifying...' : 'Unlock Admin'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const NAV: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'courses', label: 'Courses, Pricing & Drive Upload', icon: BookOpen },
    { id: 'sections', label: 'All Page Sections & Hero', icon: Layers },
    { id: 'masterclasses', label: 'Masterclasses', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'lab', label: 'Hardware Lab Videos', icon: PlaySquare },
    { id: 'settings', label: 'Google Drive & Settings', icon: Settings },
  ];

  const handleUpdateCourses = (next: CourseModule[]) =>
    onUpdateState({ courses: next });
  const handleUpdateProfile = (next: InstructorProfile) =>
    onUpdateState({ profile: next });
  const handleUpdateSections = (next: SiteSectionsConfig) =>
    onUpdateState({ sections: next });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#141413] text-[#FAF9F5] border-b-[3px] border-[#D97757] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BrandMark
            dark
            customIconUrl={sanitizeImageSrc(state.profile.siteIconDataUrl)}
            className="w-8 h-8"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight">
                {state.profile.brandName}
              </span>
              <span className="px-2 py-0.5 bg-[#D97757] text-[#141413] font-mono text-[10px] font-bold rounded">
                ADMIN CMS
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline font-mono text-xs text-[#B0AEA5]">
            Changes save automatically
          </span>
          {state.security.passcodeEnabled && (
            <button
              type="button"
              onClick={handleLockNow}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#2A2926] hover:bg-[#3A3834] text-[#FAF9F5] font-bold text-xs rounded border border-[#FAF9F5]/30 cursor-pointer"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Lock</span>
            </button>
          )}
          <button
            onClick={onGoToPublicSite}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D97757] hover:bg-[#E87A54] text-[#141413] font-bold text-xs sm:text-sm rounded border-2 border-[#FAF9F5] shadow-[3px_3px_0px_#FAF9F5] cursor-pointer"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2 h-fit lg:sticky lg:top-24">
          <div className="p-4 bg-[#141413] text-[#FAF9F5] rounded-xl border-2 border-[#141413] mb-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#D97757] font-bold mb-1">
              <LayoutDashboard className="w-4 h-4" />
              <span>SITE CONTROL CENTER</span>
            </div>
            <p className="text-xs text-[#B0AEA5] leading-relaxed">
              Manage courses, pricing, Google Drive videos, and every section on
              your site.
            </p>
          </div>

          <nav className="space-y-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 border-[#141413] font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#D97757] text-[#141413] shadow-[3px_3px_0px_#141413]'
                      : 'bg-[#FFFFFF] text-[#141413] hover:bg-[#F0EEE6]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Panel */}
        <main className="lg:col-span-9 min-w-0">
          {toast && (
            <div className="mb-6 px-4 py-3 bg-[#D97757] text-[#141413] border-2 border-[#141413] rounded-lg font-bold text-sm flex items-center gap-2 shadow-[4px_4px_0px_#141413]">
              <Check className="w-4 h-4 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {activeTab === 'courses' && (
            <AdminCoursesPanel
              courses={state.courses}
              sections={state.sections}
              driveConfig={state.driveConfig}
              onUpdateCourses={handleUpdateCourses}
              onUpdateSections={handleUpdateSections}
              onNotify={notify}
            />
          )}

          {activeTab === 'sections' && (
            <AdminSectionsPanel
              profile={state.profile}
              sections={state.sections}
              onUpdateProfile={handleUpdateProfile}
              onUpdateSections={handleUpdateSections}
              onNotify={notify}
            />
          )}

          {(activeTab === 'masterclasses' ||
            activeTab === 'testimonials' ||
            activeTab === 'lab' ||
            activeTab === 'settings') && (
            <AdminExtrasPanel
              mode={activeTab}
              state={state}
              courses={state.courses}
              onUpdateState={onUpdateState}
              onUpdateSections={handleUpdateSections}
              onResetDefaults={onResetDefaults}
              onNotify={notify}
            />
          )}
        </main>
      </div>
    </div>
  );
};
