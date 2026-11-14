import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, LogIn, LogOut, User, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { sanitizeImageSrc } from '../utils/security';
import { CourseModule, StudentUser } from '../types/course';
import { hasCourseAccess } from '../utils/userAuth';

interface NavbarProps {
  brandName: string;
  siteIconUrl?: string;
  currentUser: StudentUser | null;
  courses: CourseModule[];
  onOpenFirstCourse: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

const NAV_LINKS = [
  { label: 'Curriculum (Beginner → Pro)', href: '#curriculum' },
  { label: 'Masterclasses', href: '#masterclasses' },
  { label: 'Engineering Case Studies', href: '#case-studies' },
  { label: 'Hardware Lab Videos', href: '#lab-videos' },
  { label: 'About ZeroToFab', href: '#about' },
];

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  siteIconUrl,
  currentUser,
  courses,
  onOpenFirstCourse,
  onOpenAuthModal,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const unlockedPaidCount = currentUser
    ? courses.filter((c) => c.price > 0 && hasCourseAccess(currentUser, c)).length
    : 0;
  const safeAvatarUrl = currentUser
    ? sanitizeImageSrc(currentUser.avatarUrl)
    : undefined;
  const initials = currentUser
    ? (currentUser.name.trim() || currentUser.email).slice(0, 2).toUpperCase()
    : '';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-40 bg-[#FAF9F5]/95 backdrop-blur-sm border-b border-[#E8E6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Geometric Brand Mark */}
        <a
          href="#top"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <BrandMark
            customIconUrl={sanitizeImageSrc(siteIconUrl)}
            className="w-9 h-9 transition-transform duration-200 group-hover:rotate-[-6deg]"
          />
          <span className="font-bold text-lg tracking-tight hidden sm:inline">
            {brandName}
          </span>
        </a>

        {/* Right: Student Auth Control + Signature 2-line Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F0EEE6] border-2 border-[#141413] rounded-lg shadow-[2px_2px_0px_#141413] transition-colors cursor-pointer"
              >
                {safeAvatarUrl ? (
                  <img
                    src={safeAvatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full border border-[#141413] object-cover shrink-0"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#D97757] border border-[#141413] flex items-center justify-center font-mono text-[10px] font-bold text-[#141413] shrink-0">
                    {initials}
                  </span>
                )}
                <span className="font-bold text-xs text-[#141413] max-w-[100px] sm:max-w-[140px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <span className="px-1.5 py-0.5 bg-[#141413] text-[#D97757] font-mono text-[10px] font-bold rounded hidden md:inline">
                  {currentUser.unlockAllCourses
                    ? 'ALL ACCESS'
                    : `${unlockedPaidCount} UNLOCKED`}
                </span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-2 bg-[#FAF9F5] hover:bg-[#F0EEE6] border-2 border-[#141413] rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#141413]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="brutal-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D97757] text-[#141413] font-bold text-xs sm:text-sm rounded-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="p-2.5 rounded-md hover:bg-[#F0EEE6] transition-colors cursor-pointer"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-[#141413]" strokeWidth={2.5} />
            ) : (
              <div className="w-6 flex flex-col gap-1.5">
                <span className="block h-[2.5px] w-full bg-[#141413]" />
                <span className="block h-[2.5px] w-full bg-[#141413]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Full-Width Neo-Brutalist Drawer (matching yehia.tech) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t-2 border-b-2 border-[#141413] bg-[#FAF9F5] shadow-[0_8px_0px_#141413]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map((item, idx) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left py-2.5 px-3 text-lg sm:text-xl font-bold tracking-tight hover:bg-[#D97757] hover:text-[#141413] rounded-md transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs opacity-60">
                      0{idx + 1}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <div className="my-5 border-t-2 border-[#E8E6DC]" />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenFirstCourse();
                  }}
                  className="brutal-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  Start Free Module
                </button>

                {currentUser ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#141413] rounded-md font-bold text-sm cursor-pointer hover:bg-[#F0EEE6]"
                    >
                      <User className="w-4 h-4 text-[#C96442]" />
                      <span>My Account ({currentUser.name})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F5] border-2 border-[#141413] rounded-md font-bold text-sm cursor-pointer hover:bg-[#F0EEE6]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141413] text-[#FAF9F5] border-2 border-[#141413] rounded-md font-bold text-sm cursor-pointer hover:bg-[#2A2926]"
                  >
                    <LogIn className="w-4 h-4 text-[#D97757]" />
                    <span>Sign In / Create Account</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
