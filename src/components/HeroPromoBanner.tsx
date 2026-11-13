import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ShieldCheck, Sparkles } from 'lucide-react';
import { InstructorProfile } from '../types/course';

interface HeroPromoBannerProps {
  profile: InstructorProfile;
  onExploreClick: () => void;
}

export const HeroPromoBanner: React.FC<HeroPromoBannerProps> = ({
  profile,
  onExploreClick,
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouse({ x, y });
  };

  const starburstLines = profile.heroStarburstText.split(' ');
  const line1 = starburstLines[0] || 'ZERO';
  const line2 = starburstLines.slice(1).join(' ') || 'TO PRO';

  return (
    <section id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        className="relative overflow-hidden rounded-2xl bg-[#141413] text-[#FAF9F5] border-2 border-[#141413] border-b-[5px] border-b-[#D97757] px-6 sm:px-12 py-14 sm:py-20 pcb-grid-bg"
      >
        <div className="pointer-events-none absolute -top-24 right-10 w-72 h-72 rounded-full bg-[#D97757]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 left-12 w-72 h-72 rounded-full bg-[#E5984B]/15 blur-[90px]" />

        {/* Top-Right Floating Glowing Terracotta QFN / IC Chip */}
        <div
          className="hidden md:block pointer-events-none absolute top-10 right-10 lg:right-20 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mouse.x * -24}px, ${mouse.y * -24}px)`,
          }}
        >
          <div className="animate-float-medium drop-shadow-[0_0_25px_rgba(217,119,87,0.45)]">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              <rect
                x="24"
                y="24"
                width="62"
                height="62"
                rx="10"
                fill="url(#chipGrad)"
                stroke="#FAF9F5"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <circle cx="38" cy="38" r="4" fill="#FAF9F5" fillOpacity="0.85" />
              <text x="41" y="61" fill="#FAF9F5" fontSize="13" fontFamily="monospace" fontWeight="bold">
                PCB
              </text>
              {[34, 48, 62, 76].map((p) => (
                <React.Fragment key={p}>
                  <rect x="10" y={p - 3} width="14" height="6" rx="2" fill="#E5984B" />
                  <rect x="86" y={p - 3} width="14" height="6" rx="2" fill="#E5984B" />
                  <rect x={p - 3} y="10" width="6" height="14" rx="2" fill="#E5984B" />
                  <rect x={p - 3} y="86" width="6" height="14" rx="2" fill="#E5984B" />
                </React.Fragment>
              ))}
              <defs>
                <linearGradient id="chipGrad" x1="24" y1="24" x2="86" y2="86">
                  <stop stopColor="#E87A54" />
                  <stop offset="1" stopColor="#C96442" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Left Floating Frosted Cream Via / Copper Ring */}
        <div
          className="hidden md:block pointer-events-none absolute top-1/2 -translate-y-1/2 left-6 lg:left-14 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`,
          }}
        >
          <div className="animate-float-slow opacity-90 drop-shadow-[0_0_24px_rgba(250,249,245,0.22)]">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              <circle cx="48" cy="48" r="34" stroke="#FAF9F5" strokeOpacity="0.85" strokeWidth="14" />
              <circle cx="48" cy="48" r="18" stroke="#D97757" strokeWidth="4" />
              <path d="M48 4 V14 M48 82 V92 M4 48 H14 M82 48 H92" stroke="#FAF9F5" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Bottom-Right Floating Amber-Copper SMD Badge */}
        <div
          className="hidden sm:block pointer-events-none absolute bottom-8 right-8 lg:right-24 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mouse.x * -16}px, ${mouse.y * 16}px)`,
          }}
        >
          <div className="animate-float-reverse drop-shadow-[0_0_24px_rgba(229,152,75,0.45)]">
            <svg width="104" height="80" viewBox="0 0 104 80" fill="none">
              <rect x="8" y="16" width="88" height="48" rx="12" fill="url(#smdGrad)" stroke="#FAF9F5" strokeOpacity="0.35" strokeWidth="2" />
              <rect x="8" y="16" width="22" height="48" rx="6" fill="#FAF9F5" fillOpacity="0.85" />
              <rect x="74" y="16" width="22" height="48" rx="6" fill="#FAF9F5" fillOpacity="0.85" />
              <text x="36" y="45" fill="#141413" fontSize="13" fontFamily="monospace" fontWeight="bold">50Ω</text>
              <defs>
                <linearGradient id="smdGrad" x1="8" y1="16" x2="96" y2="64">
                  <stop stopColor="#E5984B" />
                  <stop offset="1" stopColor="#D97757" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#C96442] text-[#FAF9F5] border border-[#FAF9F5]/20 font-mono text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_24px_rgba(217,119,87,0.4)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile.heroBadge}</span>
          </motion.div>

          <h1 className="brutal-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FAF9F5] leading-[1.03] mb-7">
            {profile.heroTitle}
          </h1>

          {/* Jagged Starburst + Claude Orange Brutalist Box */}
          <motion.div
            initial={{ opacity: 0, y: 12, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex items-center mb-8"
          >
            <div className="relative z-20 -mr-4 flex items-center justify-center">
              <svg
                viewBox="0 0 110 110"
                className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[3px_3px_0px_#141413]"
              >
                <polygon
                  points="55,4 67,19 86,11 86,30 105,34 94,51 107,66 89,74 93,93 74,90 65,106 50,94 33,104 29,85 10,85 19,67 4,55 19,41 12,22 31,25 40,8"
                  fill="#FAF9F5"
                  stroke="#141413"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-mono text-[10px] sm:text-xs font-extrabold uppercase tracking-tight text-[#141413] text-center leading-tight -rotate-6">
                {line1}
                <br />
                {line2}
              </span>
            </div>

            <div className="relative z-10 px-6 sm:px-9 py-3 sm:py-4 bg-[#D97757] text-[#141413] border-[3px] border-[#141413] shadow-[5px_5px_0px_#FAF9F5]">
              <span className="brutal-display text-2xl sm:text-4xl md:text-5xl tracking-tight">
                {profile.heroOfferBoxText}
              </span>
            </div>
          </motion.div>

          <p className="text-sm sm:text-base md:text-lg text-[#E8E6DC]/90 max-w-xl mb-8 leading-relaxed">
            {profile.heroSubtitle}
          </p>

          <button
            onClick={onExploreClick}
            className="group inline-flex items-center gap-3 px-7 py-3.5 border-2 border-[#FAF9F5] bg-transparent hover:bg-[#D97757] hover:border-[#D97757] hover:text-[#141413] text-[#FAF9F5] font-bold text-base transition-all duration-200 cursor-pointer"
          >
            <span>{profile.heroCtaText}</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </button>

          <div className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-[#B0AEA5]">
            <ShieldCheck className="w-4 h-4 text-[#D97757]" />
            <span>{profile.heroGuaranteeText}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
