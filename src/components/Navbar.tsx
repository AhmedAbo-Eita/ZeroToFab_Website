import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { sanitizeImageSrc } from '../utils/security';

interface NavbarProps {
  brandName: string;
  siteIconUrl?: string;
  onOpenFirstCourse: () => void;
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
  onOpenFirstCourse,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Right: Signature 2-line Hamburger */}
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
