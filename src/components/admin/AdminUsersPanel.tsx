import React, { useState } from 'react';
import {
  Ban,
  Check,
  CheckCircle2,
  KeyRound,
  Lock,
  Search,
  Sparkles,
  Trash2,
  Unlock,
  UserPlus,
  Users,
} from 'lucide-react';
import { CourseModule, StudentUser } from '../../types/course';
import { isValidEmail, normalizeEmail } from '../../utils/userAuth';
import {
  hashAdminPassword,
  sanitizeImageSrc,
  validatePasswordStrength,
} from '../../utils/security';

interface AdminUsersPanelProps {
  users: StudentUser[];
  courses: CourseModule[];
  onUpdateUsers: (next: StudentUser[]) => void;
  onNotify: (msg: string) => void;
}

export const AdminUsersPanel: React.FC<AdminUsersPanelProps> = ({
  users,
  courses,
  onUpdateUsers,
  onNotify,
}) => {
  // New / Pre-Authorize User Form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newUnlockAll, setNewUnlockAll] = useState(false);
  const [newUnlockedIds, setNewUnlockedIds] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // User list search & inline password reset
  const [searchQuery, setSearchQuery] = useState('');
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [resetPwdInput, setResetPwdInput] = useState('');
  const [resetBusy, setResetBusy] = useState(false);

  const paidCourses = courses.filter((c) => c.price > 0);
  const freeCoursesCount = courses.filter((c) => c.price === 0).length;

  const toggleNewCourseId = (courseId: string) => {
    setNewUnlockedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = normalizeEmail(newEmail);
    if (!isValidEmail(cleanEmail)) {
      onNotify('Please enter a valid email address.');
      return;
    }
    if (users.some((u) => normalizeEmail(u.email) === cleanEmail)) {
      onNotify(`A user with email "${cleanEmail}" already exists.`);
      return;
    }

    let passwordHash: string | undefined;
    if (newPassword.trim()) {
      const strengthErr = validatePasswordStrength(newPassword);
      if (strengthErr) {
        onNotify(strengthErr);
        return;
      }
      setCreating(true);
      try {
        passwordHash = await hashAdminPassword(newPassword);
      } finally {
        setCreating(false);
      }
    }

    const created: StudentUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: newName.trim() || cleanEmail.split('@')[0],
      passwordHash,
      unlockedCourseIds: newUnlockedIds,
      unlockAllCourses: newUnlockAll,
      status: 'active',
      createdAt: new Date().toISOString(),
      notes: newNotes.trim() || undefined,
    };

    onUpdateUsers([created, ...users]);
    setNewEmail('');
    setNewName('');
    setNewPassword('');
    setNewNotes('');
    setNewUnlockAll(false);
    setNewUnlockedIds([]);
    onNotify(`Added user "${created.email}" with configured course access.`);
  };

  const updateUser = (userId: string, patch: Partial<StudentUser>) => {
    onUpdateUsers(
      users.map((u) => (u.id === userId ? { ...u, ...patch } : u))
    );
  };

  const handleToggleCourseAccess = (user: StudentUser, courseId: string) => {
    const exists = user.unlockedCourseIds.includes(courseId);
    const nextIds = exists
      ? user.unlockedCourseIds.filter((id) => id !== courseId)
      : [...user.unlockedCourseIds, courseId];
    updateUser(user.id, { unlockedCourseIds: nextIds });
  };

  const handleSaveResetPassword = async (user: StudentUser) => {
    const strengthErr = validatePasswordStrength(resetPwdInput);
    if (strengthErr) {
      onNotify(strengthErr);
      return;
    }
    setResetBusy(true);
    try {
      const hashed = await hashAdminPassword(resetPwdInput);
      updateUser(user.id, { passwordHash: hashed });
      setResettingUserId(null);
      setResetPwdInput('');
      onNotify(`Updated password for ${user.email}.`);
    } finally {
      setResetBusy(false);
    }
  };

  const handleDeleteUser = (user: StudentUser) => {
    onUpdateUsers(users.filter((u) => u.id !== user.id));
    onNotify(`Removed user "${user.email}".`);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    if (!normalizedQuery) return true;
    return (
      u.email.toLowerCase().includes(normalizedQuery) ||
      u.name.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="space-y-8">
      {/* Add / Pre-Authorize User + Registered Users Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Add / Pre-Authorize User Form */}
        <form
          onSubmit={handleCreateUser}
          className="xl:col-span-5 p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4 h-fit xl:sticky xl:top-24"
        >
          <h3 className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#C96442]" />
            <span>Add or Pre-Authorize User</span>
          </h3>
          <p className="text-xs text-[#5C5A54] leading-relaxed">
            Create a student account with a password, or pre-authorize an email
            address with unlocked paid modules so they can claim it on Sign Up.
          </p>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase mb-1">
              User Email Address *
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Nadia Mansour"
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase mb-1">
              Optional Password (min 8 chars)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank so user sets password on Sign Up"
              autoComplete="new-password"
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-mono"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold uppercase mb-1">
              Admin Note (optional)
            </label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Cohort 04 VIP seat"
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>

          {/* Initial Course Access Selector */}
          <div className="p-3.5 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg space-y-2.5">
            <div className="font-mono text-[11px] font-bold uppercase text-[#C96442]">
              Initial Content Access
            </div>

            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={newUnlockAll}
                onChange={(e) => setNewUnlockAll(e.target.checked)}
                className="w-4 h-4 accent-[#D97757]"
              />
              <span>Grant All Paid Courses (All-Access Pass)</span>
            </label>

            {paidCourses.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#E8E6DC]">
                {paidCourses.map((course) => (
                  <label
                    key={course.id}
                    className={`flex items-center gap-2 text-xs cursor-pointer ${
                      newUnlockAll ? 'opacity-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={newUnlockAll}
                      checked={
                        newUnlockAll || newUnlockedIds.includes(course.id)
                      }
                      onChange={() => toggleNewCourseId(course.id)}
                      className="w-4 h-4 accent-[#D97757]"
                    />
                    <span className="font-mono text-[11px] font-bold">
                      [{course.number}]
                    </span>
                    <span className="truncate">{course.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={creating}
            className="brutal-btn w-full py-3 bg-[#D97757] text-[#141413] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            <span>{creating ? 'Creating...' : 'Save & Pre-Authorize User'}</span>
          </button>
        </form>

        {/* Right: Registered Users & Per-User Content Access */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C96442]" />
                <span>Registered Users &amp; Access ({users.length})</span>
              </h3>
              <p className="text-xs text-[#5C5A54]">
                {freeCoursesCount} free module{freeCoursesCount === 1 ? '' : 's'}{' '}
                always open · Toggle paid modules individually below.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#5C5A54] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg text-xs"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-8 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl text-center text-sm text-[#5C5A54]">
              No matching student accounts found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const safeAvatar = sanitizeImageSrc(user.avatarUrl);
                const isResetting = resettingUserId === user.id;

                return (
                  <div
                    key={user.id}
                    className={`p-5 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4 ${
                      user.status === 'suspended' ? 'opacity-80 bg-[#F0EEE6]' : ''
                    }`}
                  >
                    {/* User Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {safeAvatar ? (
                          <img
                            src={safeAvatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border-2 border-[#141413] object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#D97757] border-2 border-[#141413] flex items-center justify-center font-bold text-xs text-[#141413] shrink-0">
                            {(user.name || user.email).slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-base text-[#141413] truncate">
                              {user.name}
                            </span>
                            <span className="px-2 py-0.5 bg-[#141413] text-[#FAF9F5] font-mono text-[10px] font-bold rounded uppercase">
                              {user.passwordHash
                                ? 'PASSWORD SET'
                                : 'NEEDS PASSWORD'}
                            </span>
                            <span
                              className={`px-2 py-0.5 border border-[#141413] font-mono text-[10px] font-bold rounded uppercase ${
                                user.status === 'active'
                                  ? 'bg-[#D97757]/25 text-[#141413]'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                          <div className="font-mono text-xs text-[#5C5A54] truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus =
                              user.status === 'active' ? 'suspended' : 'active';
                            updateUser(user.id, { status: nextStatus });
                            onNotify(
                              `${user.email} is now ${nextStatus}.`
                            );
                          }}
                          className={`px-2.5 py-1.5 border border-[#141413] rounded font-bold text-xs inline-flex items-center gap-1 cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-[#FAF9F5] hover:bg-red-50 text-[#141413]'
                              : 'bg-[#D97757] text-[#141413]'
                          }`}
                          title={
                            user.status === 'active'
                              ? 'Suspend account'
                              : 'Activate account'
                          }
                        >
                          {user.status === 'active' ? (
                            <>
                              <Ban className="w-3.5 h-3.5 text-red-700" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (isResetting) {
                              setResettingUserId(null);
                              setResetPwdInput('');
                            } else {
                              setResettingUserId(user.id);
                              setResetPwdInput('');
                            }
                          }}
                          className="px-2.5 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EEE6] border border-[#141413] rounded font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#C96442]" />
                          <span>Password</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          aria-label={`Delete ${user.email}`}
                          className="p-1.5 border border-[#141413] rounded text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Editable Admin Note */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center text-[11px]">
                      <div className="font-mono text-[#5C5A54]">
                        Added:{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLoginAt && (
                          <span>
                            {' · '}Last login:{' '}
                            {new Date(user.lastLoginAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={user.notes || ''}
                        onChange={(e) =>
                          updateUser(user.id, { notes: e.target.value })
                        }
                        placeholder="Add admin note for this student..."
                        className="px-2.5 py-1 bg-[#FAF9F5] border border-[#E8E6DC] focus:border-[#141413] rounded text-xs"
                      />
                    </div>

                    {/* Inline Set / Reset Password */}
                    {isResetting && (
                      <div className="p-3 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg flex flex-wrap items-center gap-2">
                        <input
                          type="password"
                          value={resetPwdInput}
                          onChange={(e) => setResetPwdInput(e.target.value)}
                          placeholder="New password (min 8 chars)"
                          autoComplete="new-password"
                          className="flex-1 min-w-[180px] px-3 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-xs font-mono"
                        />
                        <button
                          type="button"
                          disabled={resetBusy}
                          onClick={() => handleSaveResetPassword(user)}
                          className="px-3 py-1.5 bg-[#D97757] border border-[#141413] rounded font-bold text-xs cursor-pointer disabled:opacity-60"
                        >
                          {resetBusy ? 'Saving...' : 'Save Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResettingUserId(null);
                            setResetPwdInput('');
                          }}
                          className="px-2.5 py-1.5 border border-[#141413] rounded font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Per-User Content Access Section */}
                    <div className="pt-3 border-t border-[#E8E6DC] space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase text-[#141413]">
                          Adjust Content Access (Paid Modules)
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const nextAll = !user.unlockAllCourses;
                            updateUser(user.id, { unlockAllCourses: nextAll });
                            onNotify(
                              nextAll
                                ? `Granted All-Access Pass to ${user.email}.`
                                : `Switched ${user.email} to individual module permissions.`
                            );
                          }}
                          className={`px-3 py-1 rounded border-2 border-[#141413] font-mono text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            user.unlockAllCourses
                              ? 'bg-[#141413] text-[#D97757]'
                              : 'bg-[#FAF9F5] text-[#141413] hover:bg-[#F0EEE6]'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {user.unlockAllCourses
                              ? 'All Paid Courses: UNLOCKED'
                              : 'Grant All Paid Courses'}
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {paidCourses.map((course) => {
                          const individuallyUnlocked =
                            user.unlockedCourseIds.includes(course.id);
                          const effectiveUnlocked =
                            Boolean(user.unlockAllCourses) ||
                            individuallyUnlocked;

                          return (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() =>
                                handleToggleCourseAccess(user, course.id)
                              }
                              className={`px-3 py-1.5 rounded-lg border-2 border-[#141413] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                                effectiveUnlocked
                                  ? 'bg-[#D97757] text-[#141413] shadow-[2px_2px_0px_#141413]'
                                  : 'bg-[#FAF9F5] text-[#5C5A54] hover:bg-[#F0EEE6]'
                              }`}
                              title={
                                user.unlockAllCourses
                                  ? 'Covered by All-Access Pass (click to toggle individual state)'
                                  : individuallyUnlocked
                                  ? 'Click to lock this module for this user'
                                  : 'Click to unlock this module for this user'
                              }
                            >
                              {effectiveUnlocked ? (
                                user.unlockAllCourses && !individuallyUnlocked ? (
                                  <Unlock className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 shrink-0" />
                                )
                              ) : (
                                <Lock className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span className="font-mono text-[10px]">
                                [{course.number}]
                              </span>
                              <span className="truncate max-w-[190px]">
                                {course.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
