import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CalloutConfig, CaseStudyItem } from '../types/course';
import { EyebrowBrick } from './BrandMark';
import { CaseStudyBlueprint } from './PcbArtwork';

interface CaseStudiesSectionProps {
  eyebrow: string;
  heading: string;
  caseStudies: CaseStudyItem[];
  callout: CalloutConfig;
  onOpenModule: (moduleId: string) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  eyebrow,
  heading,
  caseStudies,
  callout,
  onOpenModule,
}) => {
  return (
    <section
      id="case-studies"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t-2 border-[#E8E6DC]"
    >
      <EyebrowBrick label={eyebrow} />
      <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#141413] max-w-3xl leading-tight mb-10">
        {heading}
      </h2>

      {/* Case Study Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {caseStudies.map((cs, idx) => (
          <motion.div
            key={cs.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: idx * 0.08, duration: 0.45 }}
            className="brutal-card bg-[#FFFFFF] rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2.5 py-1 border-2 border-[#141413] font-mono text-xs font-bold ${
                    idx % 2 === 0 ? 'bg-[#D97757]' : 'bg-[#E5984B]'
                  }`}
                >
                  {cs.badge}
                </span>
                <span className="font-mono text-xs text-[#5C5A54]">
                  {cs.tag}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-3 tracking-tight">
                {cs.title}
              </h3>
              <p className="text-sm sm:text-base text-[#5C5A54] mb-5 leading-relaxed">
                {cs.description}
              </p>
              <CaseStudyBlueprint variant={cs.variant} />
            </div>

            <button
              onClick={() => onOpenModule(cs.linkedModuleId)}
              className="mt-5 inline-flex items-center gap-2 font-bold text-sm text-[#141413] hover:text-[#C96442] transition-colors cursor-pointer"
            >
              <span>{cs.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Dark Consultation / Design Review Callout Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-[#141413] text-[#FAF9F5] border-2 border-[#141413] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-[6px_6px_0px_#D97757]"
      >
        <div className="lg:col-span-7">
          <span className="inline-block px-3 py-1 rounded bg-[#D97757] text-[#141413] font-mono text-xs font-bold mb-4">
            {callout.badge}
          </span>
          <h3 className="brutal-display text-2xl sm:text-4xl text-[#FAF9F5] mb-4 leading-tight">
            {callout.headline}
          </h3>
          <p className="text-[#B0AEA5] text-sm sm:text-base mb-6 max-w-xl leading-relaxed">
            {callout.description}
          </p>
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-[#E8E6DC] mb-6">
            {callout.bullets.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D97757]" /> {b}
              </span>
            ))}
          </div>
          <button
            onClick={() => onOpenModule(callout.linkedModuleId)}
            className="brutal-btn inline-flex items-center gap-2 px-6 py-3 bg-[#D97757] text-[#141413] font-bold text-sm cursor-pointer"
          >
            <span>{callout.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tilted Polaroid-style Hardware Lab Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="bg-[#FAF9F5] text-[#141413] p-3.5 pb-5 rounded-lg border-2 border-[#FAF9F5] rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs w-full shadow-[6px_6px_0px_#C96442]">
            <div className="aspect-[4/3] rounded bg-[#141413] pcb-grid-bg flex flex-col items-center justify-center p-4 border-2 border-[#141413]">
              <div className="w-full flex justify-between font-mono text-[10px] text-[#E5984B] mb-2">
                <span>{callout.polaroidScopeLabel}</span>
                <span>{callout.polaroidScopeMetric}</span>
              </div>
              <svg viewBox="0 0 240 90" className="w-full h-20">
                <path
                  d="M0 50 Q20 42 40 50 T80 50 T120 48 T160 51 T200 49 T240 50"
                  stroke="#D97757"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M0 70 H60 L75 24 H135 L150 70 H240"
                  stroke="#E5984B"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
              <span className="font-mono text-[10px] text-[#B0AEA5] mt-1">
                {callout.polaroidScopeFooter}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-sm">{callout.polaroidTitle}</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-[#D97757] border border-[#141413] font-bold">
                {callout.polaroidStatus}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
