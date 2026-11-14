/**
 * Student authentication, session persistence, and per-user course/lesson access control utilities.
 */

import { CourseModule, Lesson, StudentUser } from '../types/course';

export const USER_SESSION_STORAGE_KEY = 'ztf_student_session_v1';

export interface StoredUserSession {
  userId: string;
  email: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function loadUserSession(): StoredUserSession | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredUserSession>;
    if (
      typeof parsed.userId === 'string' &&
      parsed.userId.trim() &&
      typeof parsed.email === 'string' &&
      parsed.email.trim()
    ) {
      return {
        userId: parsed.userId,
        email: normalizeEmail(parsed.email),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveUserSession(user: StudentUser): void {
  try {
    localStorage.setItem(
      USER_SESSION_STORAGE_KEY,
      JSON.stringify({
        userId: user.id,
        email: normalizeEmail(user.email),
      } satisfies StoredUserSession)
    );
  } catch {
    // ignore storage quota errors
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(USER_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Resolves the active `StudentUser` from the persisted session and user registry.
 * Returns `null` if no session exists, the user was deleted, or the account is suspended.
 */
export function resolveActiveUser(
  users: StudentUser[],
  session: StoredUserSession | null
): StudentUser | null {
  if (!session) return null;
  const target = users.find(
    (u) =>
      u.id === session.userId ||
      normalizeEmail(u.email) === normalizeEmail(session.email)
  );
  if (!target || target.status !== 'active') {
    return null;
  }
  return target;
}

/**
 * Checks whether a visitor or signed-in student has full access to a CourseModule.
 * Free modules (`price === 0`) are always open to everyone.
 */
export function hasCourseAccess(
  user: StudentUser | null,
  course: CourseModule
): boolean {
  if (course.price === 0) return true;
  if (!user || user.status !== 'active') return false;
  if (user.unlockAllCourses) return true;
  return user.unlockedCourseIds.includes(course.id);
}

/**
 * Checks whether a specific Lesson inside a CourseModule is playable.
 * Accessible if the full course is unlocked OR the lesson is marked as a Free Preview.
 */
export function hasLessonAccess(
  user: StudentUser | null,
  course: CourseModule,
  lesson: Lesson
): boolean {
  if (hasCourseAccess(user, course)) return true;
  return Boolean(lesson.isFreePreview);
}
