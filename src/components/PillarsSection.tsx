import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Wrench } from 'lucide-react';
import { PillarItem } from '../types/course';
import { BrushUnderline, EyebrowBrick } from './BrandMark';

interface PillarsSectionProps {
  eyebrow: string;
  heading: string;
  items: PillarItem[];
}

const ICONS = {
  cpu: Cpu,
  layers: Layers,
  wrench: Wrench,
};

export const PillarsSection: React.FC<PillarsSectionProps> = ({
  eyebrow,
  heading,
  items,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="mb-12">
        <EyebrowBrick label={eyebrow} />
        <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#141413] max-w-3xl leading-tight">
          <span className="relative inline-block">
            {heading}
            <BrushUnderline className="absolute left-0 -bottom-2 w-48 h-3.5" />
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((pillar, idx) => {
          const Icon = ICONS[pillar.icon] || Cpu;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              className="brutal-card bg-[#FAF9F5] p-6 sm:p-7 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-block px-2.5 py-1 bg-[#D97757] text-[#141413] border-2 border-[#141413] font-mono text-xs font-bold">
                    [{pillar.num}]
                  </span>

                  <div className="w-12 h-12 rounded-lg bg-[#D97757]/25 border-2 border-[#141413] flex items-center justify-center shadow-[2px_2px_0px_#141413]">
                    <Icon className="w-6 h-6 text-[#141413]" strokeWidth={2.2} />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-3 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-[#5C5A54] leading-relaxed text-sm sm:text-base">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
