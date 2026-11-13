import React from 'react';
import { motion } from 'framer-motion';
import { EcosystemItem } from '../types/course';
import { EyebrowBrick } from './BrandMark';

interface TrustStripProps {
  eyebrow: string;
  heading: string;
  items: EcosystemItem[];
}

export const TrustStrip: React.FC<TrustStripProps> = ({
  eyebrow,
  heading,
  items,
}) => {
  return (
    <section className="w-full bg-[#141413] text-[#FAF9F5] border-y-2 border-[#141413] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowBrick label={eyebrow} dark />

        <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F5] mb-10 max-w-2xl leading-tight">
          {heading}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ y: -3, borderColor: '#D97757' }}
              className="rounded-lg bg-[#1C1C1A] border-[1.5px] border-[#2E2D2A] p-5 transition-colors"
            >
              <div className="font-bold text-base sm:text-lg text-[#FAF9F5] tracking-tight">
                {item.name}
              </div>
              <div className="font-mono text-xs text-[#B0AEA5] mt-1">
                {item.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
