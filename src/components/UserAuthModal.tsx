import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { CourseModule, StudentUser } from '../types/course';
import {
  hasCourseAccess,
  isValidEmail,
  normalizeEmail,
} from '../utils/userAuth';
import {
  hashAdminPassword,
  sanitizeImageSrc,
  validatePasswordStrength,
  verifyAdminPassword,
} from '../utils/security';

interface UserAuthModalProps {
  isOpen: boolean;
  currentUser: StudentUser | null;
  users: StudentUser[];
  courses: CourseModule[];
  onAuthenticated: (user: StudentUser, updatedUsers: StudentUser[]) => void;
  onLogout: () => void;
  onSelectCourse: (course: CourseModule) => void;
  onClose: () => void;
}

function getInitials(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  currentUser,
  users,
  courses,
  onAuthenticated,
  onLogout,
  onSelectCourse,
  onClose,
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePasswordAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isValidEmail(emailInput)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanEmail = normalizeEmail(emailInput);
    const now = new Date().toISOString();
    const existing = users.find((u) => normalizeEmail(u.email) === cleanEmail);

    if (authTab === 'signin') {
      if (!passwordInput) {
        setErrorMsg('Please enter your password.');
        return;
      }
      if (!existing) {
        setErrorMsg(
          'No account found for this email. Switch to "Create Account" to register.'
        );
        return;
      }
      if (existing.status === 'suspended') {
        setErrorMsg(
          'This account has been suspended. Please contact the course administrator.'
        );
        return;
      }
      if (!existing.passwordHash) {
        setErrorMsg(
          'This pre-authorized account does not have a password yet. Switch to "Create Account" with this email to set your password.'
        );
        return;
      }

      setBusy(true);
      try {
        const ok = await verifyAdminPassword(
          passwordInput,
          existing.passwordHash
        );
        if (!ok) {
          setErrorMsg('Incorrect email or password.');
          return;
        }
        const updatedUser: StudentUser = {
          ...existing,
          lastLoginAt: now,
        };
        const updatedUsers = users.map((u) =>
          u.id === existing.id ? updatedUser : u
        );
        setPasswordInput('');
        onAuthenticated(updatedUser, updatedUsers);
      } finally {
        setBusy(false);
      }
      return;
    }

    // Create Account (or claim pre-authorized email without passwordHash)
    const strengthErr = validatePasswordStrength(passwordInput);
    if (strengthErr) {
      setErrorMsg(strengthErr);
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (existing) {
      if (existing.status === 'suspended') {
        setErrorMsg(
          'This account has been suspended. Please contact the course administrator.'
        );
        return;
      }
      if (existing.passwordHash) {
        setErrorMsg(
          'An account with this email already exists. Please Sign In instead.'
        );
        return;
      }
    }

    setBusy(true);
    try {
      const hashed = await hashAdminPassword(passwordInput);
      if (existing) {
        const claimedUser: StudentUser = {
          ...existing,
          name: nameInput.trim() || existing.name,
          passwordHash: hashed,
          lastLoginAt: now,
        };
        const updatedUsers = users.map((u) =>
          u.id === existing.id ? claimedUser : u
        );
        setPasswordInput('');
        setConfirmPasswordInput('');
        onAuthenticated(claimedUser, updatedUsers);
      } else {
        const createdUser: StudentUser = {
          id: `user-${Date.now()}`,
          email: cleanEmail,
          name: nameInput.trim() || cleanEmail.split('@')[0],
          passwordHash: hashed,
          unlockedCourseIds: [],
          unlockAllCourses: false,
          status: 'active',
          createdAt: now,
          lastLoginAt: now,
        };
        setPasswordInput('');
        setConfirmPasswordInput('');
        onAuthenticated(createdUser, [...users, createdUser]);
      }
    } finally {
      setBusy(false);
    }
  };

  const accessibleCourses = currentUser
    ? courses.filter((c) => hasCourseAccess(currentUser, c))
    : [];
  const paidCoursesUnlockedCount = currentUser
    ? courses.filter(
        (c) => c.price > 0 && hasCourseAccess(currentUser, c)
      ).length
    : 0;
  const safeAvatarUrl = currentUser
    ? sanitizeImageSrc(currentUser.avatarUrl)
    : undefined;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#141413]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[92vh] bg-[#FAF9F5] border-[3px] border-[#141413] rounded-2xl shadow-[8px_8px_0px_#D97757] flex flex-col overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-5 py-4 bg-[#141413] text-[#FAF9F5] flex items-center justify-between gap-4 border-b-2 border-[#141413]">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 bg-[#D97757] text-[#141413] font-mono text-[10px] font-bold rounded uppercase">
                  {currentUser ? 'STUDENT ACCOUNT' : 'STUDENT PORTAL'}
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg truncate">
                {currentUser
                  ? 'Your Profile & Course Access'
                  : 'Sign In or Create Account'}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close sign in dialog"
              className="p-2 rounded bg-[#2A2926] hover:bg-[#D97757] hover:text-[#141413] text-[#FAF9F5] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {currentUser ? (
              /* Logged-In Profile & Unlocked Modules View */
              <>
                <div className="p-4 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] flex items-center gap-4">
                  {safeAvatarUrl ? (
                    <img
                      src={safeAvatarUrl}
                      alt={currentUser.name}
                      className="w-14 h-14 rounded-full border-2 border-[#141413] object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#D97757] border-2 border-[#141413] flex items-center justify-center font-bold text-lg text-[#141413] shrink-0">
                      {getInitials(currentUser.name, currentUser.email)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-base text-[#141413] truncate">
                        {currentUser.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-[#141413] text-[#FAF9F5] font-mono text-[10px] font-bold rounded uppercase">
                        STUDENT
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#5C5A54] truncate mt-0.5">
                      {currentUser.email}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F0EEE6] border border-[#141413] rounded font-mono text-[11px] font-bold text-[#141413]">
                      {currentUser.unlockAllCourses ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#C96442]" />
                          <span>All-Access Pass Active</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-[#C96442]" />
                          <span>
                            {paidCoursesUnlockedCount} Paid Course
                            {paidCoursesUnlockedCount === 1 ? '' : 's'} Unlocked
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141413]">
                      Accessible Modules ({accessibleCourses.length})
                    </h5>
                  </div>

                  {accessibleCourses.length === 0 ? (
                    <div className="p-4 bg-[#F0EEE6] border-2 border-[#141413] rounded-xl text-xs text-[#5C5A54]">
                      No modules available yet. Contact the administrator to
                      unlock paid modules for <strong>{currentUser.email}</strong>.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {accessibleCourses.map((course) => (
                        <div
                          key={course.id}
                          className="p-3.5 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#D97757] border border-[#141413] rounded">
                                MOD {course.number}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-[#5C5A54] uppercase">
                                {course.price === 0
                                  ? 'FREE OPEN ACCESS'
                                  : 'UNLOCKED'}
                              </span>
                            </div>
                            <div className="font-bold text-sm text-[#141413] truncate">
                              {course.title}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectCourse(course);
                            }}
                            className="brutal-btn shrink-0 px-3 py-1.5 bg-[#D97757] text-[#141413] font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Open Module</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-[#F0EEE6] border border-[#E8E6DC] rounded-lg text-xs text-[#5C5A54] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C96442] shrink-0 mt-0.5" />
                  <span>
                    Course permissions are managed by the site administrator. Free
                    preview lessons remain open across all modules.
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t-2 border-[#E8E6DC]">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F0EEE6] border-2 border-[#141413] rounded-lg font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#C96442]" />
                    <span>Sign Out</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="brutal-btn px-5 py-2.5 bg-[#141413] text-[#FAF9F5] font-bold text-xs cursor-pointer"
                  >
                    Continue Learning
                  </button>
                </div>
              </>
            ) : (
              /* Logged-Out Sign In / Sign Up View (User Data Only) */
              <>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#F0EEE6] border-2 border-[#141413] rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signin');
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                      authTab === 'signin'
                        ? 'bg-[#D97757] text-[#141413] border border-[#141413]'
                        : 'text-[#5C5A54] hover:text-[#141413]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signup');
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                      authTab === 'signup'
                        ? 'bg-[#D97757] text-[#141413] border border-[#141413]'
                        : 'text-[#5C5A54] hover:text-[#141413]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handlePasswordAuthSubmit} className="space-y-3">
                  {authTab === 'signup' && (
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Alex Mercer"
                        autoComplete="name"
                        className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#5C5A54] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="engineer@example.com"
                        autoComplete="email"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#5C5A54] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={
                          authTab === 'signup'
                            ? 'Minimum 8 characters'
                            : 'Enter your password'
                        }
                        autoComplete={
                          authTab === 'signup'
                            ? 'new-password'
                            : 'current-password'
                        }
                        className="w-full pl-9 pr-10 py-2.5 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg text-sm font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5A54] hover:text-[#141413] cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {authTab === 'signup' && (
                    <div>
                      <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPasswordInput}
                        onChange={(e) =>
                          setConfirmPasswordInput(e.target.value)
                        }
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg text-sm font-mono"
                      />
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border-2 border-red-700 rounded-lg text-xs font-bold text-red-800">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="brutal-btn w-full py-3 bg-[#D97757] text-[#141413] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>
                      {busy
                        ? 'Authenticating...'
                        : authTab === 'signin'
                        ? 'Sign In to Account'
                        : 'Create Student Account'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="p-3 bg-[#F0EEE6] border border-[#E8E6DC] rounded-lg text-[11px] text-[#5C5A54] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C96442] shrink-0 mt-0.5" />
                  <span>
                    Sign in or create an account to track lesson progress and
                    preview free content. Paid modules are unlocked per user
                    account by the Admin.
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
