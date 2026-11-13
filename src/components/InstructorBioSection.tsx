import React from 'react';
import { motion } from 'framer-motion';
import { InstructorProfile, SkillPill } from '../types/course';
import { BrushUnderline } from './BrandMark';
import { sanitizeImageSrc } from '../utils/security';

interface InstructorBioSectionProps {
  profile: InstructorProfile;
  headingPrefix: string;
  skillPills: SkillPill[];
}

const PILL_STYLES: Record<SkillPill['variant'], string> = {
  dark: 'bg-[#141413] text-[#FAF9F5]',
  orange: 'bg-[#D97757] text-[#141413]',
  amber: 'bg-[#E5984B] text-[#141413]',
  terracotta: 'bg-[#C96442] text-[#FAF9F5]',
  sand: 'bg-[#F0EEE6] text-[#141413]',
  'dark-orange': 'bg-[#141413] text-[#D97757]',
};

export const InstructorBioSection: React.FC<InstructorBioSectionProps> = ({
  profile,
  headingPrefix,
  skillPills,
}) => {
  const safePhotoUrl = sanitizeImageSrc(profile.photoDataUrl);
  return (
    <section
      id="about"
      className="w-full bg-[#FFFFFF] border-t-2 border-[#141413] py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7"
        >
          <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#141413] mb-6">
            {headingPrefix}{' '}
            <span className="relative inline-block">
              {profile.name}?
              <BrushUnderline className="absolute left-0 -bottom-2 w-full h-3.5" />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#4A4843] leading-relaxed mb-8">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {skillPills.map((pill) => (
              <span
                key={pill.id}
                className={`px-3.5 py-1.5 rounded-full border-2 border-[#141413] font-mono text-xs font-bold shadow-[2px_2px_0px_#141413] ${
                  PILL_STYLES[pill.variant] || PILL_STYLES.dark
                }`}
              >
                {pill.label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-72 sm:w-84 h-80 flex items-center justify-center">
            <div className="absolute inset-4 bg-[#D97757] border-[3px] border-[#141413] rounded-3xl rotate-[-4deg] shadow-[6px_6px_0px_#141413]" />

            <div className="relative z-10 w-64 sm:w-72 h-72 bg-[#141413] border-[3px] border-[#141413] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-5">
              {safePhotoUrl ? (
                <img
                  src={safePhotoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full pcb-grid-bg rounded-xl flex flex-col items-center justify-center text-center p-4">
                  <svg viewBox="0 0 180 140" className="w-40 h-32">
                    <rect x="20" y="20" width="140" height="100" rx="8" fill="#1C1C1A" stroke="#D97757" strokeWidth="3" />
                    <rect x="65" y="45" width="50" height="50" rx="6" fill="#E5984B" stroke="#141413" strokeWidth="2.5" />
                    <path d="M20 45 H52 L65 58" stroke="#FAF9F5" strokeWidth="2.5" fill="none" />
                    <path d="M115 70 H160" stroke="#D97757" strokeWidth="2.5" />
                    <circle cx="35" cy="33" r="4" fill="#E5984B" />
                    <circle cx="145" cy="107" r="4" fill="#E5984B" />
                  </svg>
                  <div className="font-mono text-xs text-[#FAF9F5] font-bold">
                    {profile.stats.boardsShipped}+ Production Tapeouts
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -bottom-3 -right-2 sm:-right-4 z-20 px-4 py-2 bg-[#FAF9F5] border-[2.5px] border-[#141413] rounded-lg rotate-[-5deg] shadow-[4px_4px_0px_#141413]">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#141413] tracking-tight relative">
                {profile.stickerText}
                <span className="block h-1 w-full bg-[#D97757] mt-0.5 rounded-full" />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
