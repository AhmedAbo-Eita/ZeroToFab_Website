import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { MasterclassItem } from '../types/course';
import { EyebrowBrick } from './BrandMark';

interface MasterclassesSectionProps {
  eyebrow: string;
  heading: string;
  items: MasterclassItem[];
  onOpenModule: (moduleId: string) => void;
}

export const MasterclassesSection: React.FC<MasterclassesSectionProps> = ({
  eyebrow,
  heading,
  items,
  onOpenModule,
}) => {
  return (
    <section
      id="masterclasses"
      className="w-full bg-[#141413] text-[#FAF9F5] border-y-2 border-[#141413] py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowBrick label={eyebrow} dark />
        <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F5] max-w-2xl leading-tight mb-12">
          {heading}
        </h2>

        <div className="flex flex-col gap-8">
          {items.map((mc, idx) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              className="rounded-2xl bg-[#1C1C1A] border-2 border-[#2E2D2A] hover:border-[#D97757] transition-colors p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#D97757] border-2 border-[#FAF9F5]" />
                  <div className="relative z-10 w-40 h-40 rounded-xl bg-[#141413] border-2 border-[#FAF9F5] shadow-[4px_4px_0px_#141413] p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#E5984B]">
                      <span>INTENSIVE</span>
                      <span>0{idx + 1}</span>
                    </div>
                    <svg viewBox="0 0 120 64" className="w-full h-16">
                      <rect
                        x="10"
                        y="10"
                        width="100"
                        height="44"
                        rx="4"
                        fill="#1C1C1A"
                        stroke="#D97757"
                        strokeWidth="2"
                      />
                      <path
                        d="M22 32 H48 L58 20 H98"
                        stroke="#FAF9F5"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <path
                        d="M22 42 H62 L72 30 H98"
                        stroke="#E5984B"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <circle cx="22" cy="32" r="3.5" fill="#D97757" />
                      <circle cx="98" cy="20" r="3.5" fill="#E5984B" />
                    </svg>
                    <div className="font-mono text-xs text-[#FAF9F5] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D97757]" />
                      <span>{mc.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <span className="inline-block px-3 py-1 rounded bg-[#2A2926] border border-[#D97757]/50 text-[#D97757] font-mono text-xs font-bold mb-3">
                  {mc.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#FAF9F5] mb-3 tracking-tight">
                  {mc.title}
                </h3>
                <p className="text-[#B0AEA5] text-sm sm:text-base leading-relaxed mb-5 max-w-2xl">
                  {mc.description}
                </p>

                <ul className="space-y-2.5 mb-7">
                  {mc.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-[#E8E6DC]"
                    >
                      <span className="mt-1.5 w-2.5 h-2.5 bg-[#D97757] border border-[#FAF9F5] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-5">
                  <span className="text-2xl font-bold text-[#FAF9F5]">
                    ${mc.price}{' '}
                    <span className="text-xs font-mono font-normal text-[#B0AEA5]">
                      / full replay + source files
                    </span>
                  </span>

                  <button
                    onClick={() => onOpenModule(mc.linkedModuleId)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C96442] hover:bg-[#D97757] text-[#FAF9F5] hover:text-[#141413] border-2 border-[#FAF9F5] font-bold text-sm shadow-[4px_4px_0px_#FAF9F5] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FAF9F5] transition-all cursor-pointer"
                  >
                    <span>Explore Masterclass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
