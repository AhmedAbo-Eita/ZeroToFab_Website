import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { InstructorProfile } from '../types/course';
import { BrushUnderline } from './BrandMark';
import { AnimatedCounter } from './AnimatedCounter';
import { sanitizeImageSrc } from '../utils/security';

interface InstructorHeroProps {
  profile: InstructorProfile;
  onExploreCurriculum: () => void;
}

export const InstructorHero: React.FC<InstructorHeroProps> = ({
  profile,
  onExploreCurriculum,
}) => {
  const words = profile.headline.trim().split(' ');
  const lastWord = words.pop() || 'ZeroToFab.';
  const leading = words.join(' ');
  const safePhotoUrl = sanitizeImageSrc(profile.photoDataUrl);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-7"
        >
          <h2 className="brutal-display text-4xl sm:text-5xl lg:text-6xl text-[#141413] leading-[1.08] mb-6">
            {leading}{' '}
            <span className="relative inline-block">
              {lastWord}
              <BrushUnderline className="absolute left-0 -bottom-2 w-full h-4" />
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#4A4843] leading-relaxed mb-8 max-w-2xl">
            {profile.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onExploreCurriculum}
              className="brutal-btn inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#D97757] text-[#141413] font-bold text-base cursor-pointer"
            >
              <span>{profile.primaryCtaText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Animated Social Proof Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t-2 border-[#E8E6DC]">
            <div>
              <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold text-[#141413]">
                <Star className="w-5 h-5 fill-[#D97757] text-[#D97757]" />
                <span>{profile.stats.rating}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5C5A54] mt-0.5">
                Average course rating
              </p>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#141413]">
                <AnimatedCounter value={profile.stats.students} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm text-[#5C5A54] mt-0.5">
                Engineers trained
              </p>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#141413]">
                <AnimatedCounter value={profile.stats.boardsShipped} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm text-[#5C5A54] mt-0.5">
                Production PCBs shipped
              </p>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#141413]">
                <AnimatedCounter value={profile.stats.yearsExp} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm text-[#5C5A54] mt-0.5">
                Years in hardware
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Visual Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center group">
            <svg
              viewBox="0 0 120 80"
              className="absolute -top-4 -right-2 w-24 h-16 text-[#141413] pointer-events-none transition-transform duration-300 group-hover:scale-110"
              fill="none"
            >
              <path d="M18 58 L42 26" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M40 66 L74 44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M48 76 L86 68" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>

            <div className="absolute inset-4 rounded-full bg-[#D97757] border-2 border-[#141413] translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4" />

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#141413] border-[3px] border-[#141413] overflow-hidden flex items-center justify-center shadow-[0_10px_25px_rgba(20,20,19,0.18)]">
              {safePhotoUrl ? (
                <img
                  src={safePhotoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full pcb-grid-bg flex flex-col items-center justify-center p-6 text-center relative">
                  <svg viewBox="0 0 220 220" className="w-48 h-48">
                    <circle cx="110" cy="110" r="88" stroke="#D97757" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                    <rect x="46" y="54" width="128" height="112" rx="10" fill="#1C1C1A" stroke="#FAF9F5" strokeWidth="2.5" />
                    <rect x="82" y="84" width="56" height="56" rx="6" fill="#D97757" stroke="#141413" strokeWidth="2.5" />
                    <text x="90" y="116" fill="#141413" fontSize="13" fontFamily="monospace" fontWeight="bold">
                      4-8L
                    </text>
                    <path d="M54 74 H74 L82 90" stroke="#E5984B" strokeWidth="2.5" fill="none" />
                    <path d="M54 88 H70 L82 104" stroke="#E5984B" strokeWidth="2.5" fill="none" />
                    <path d="M138 92 L152 74 H166" stroke="#FAF9F5" strokeWidth="2.5" fill="none" />
                    <path d="M138 112 H166" stroke="#D97757" strokeWidth="2.5" fill="none" />
                    <path d="M110 140 V156" stroke="#E5984B" strokeWidth="2.5" />
                    {[
                      [56, 64],
                      [164, 64],
                      [56, 156],
                      [164, 156],
                    ].map(([cx, cy]) => (
                      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#141413" stroke="#E5984B" strokeWidth="2" />
                    ))}
                  </svg>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
