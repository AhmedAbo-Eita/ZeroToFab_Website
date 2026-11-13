import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { LabVideoItem } from '../types/course';
import { BrushUnderline, EyebrowBrick } from './BrandMark';

interface ContentLabSectionProps {
  eyebrow: string;
  heading: string;
  bottomCtaText: string;
  videos: LabVideoItem[];
  onWatchVideo: (video: LabVideoItem) => void;
  onExploreAll: () => void;
}

export const ContentLabSection: React.FC<ContentLabSectionProps> = ({
  eyebrow,
  heading,
  bottomCtaText,
  videos,
  onWatchVideo,
  onExploreAll,
}) => {
  return (
    <section
      id="lab-videos"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t-2 border-[#E8E6DC]"
    >
      <EyebrowBrick label={eyebrow} />
      <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#141413] max-w-3xl leading-tight mb-10">
        <span className="relative inline-block">
          {heading}
          <BrushUnderline className="absolute left-0 -bottom-2 w-44 h-3.5" />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {videos.map((vid, idx) => (
          <motion.div
            key={vid.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.07, duration: 0.4 }}
            className="brutal-card bg-[#FFFFFF] rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div
                onClick={() => onWatchVideo(vid)}
                className="relative aspect-video bg-[#141413] pcb-grid-bg border-b-2 border-[#141413] flex items-center justify-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#D97757] border-2 border-[#FAF9F5] flex items-center justify-center shadow-[3px_3px_0px_#141413] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-[#141413] text-[#141413] ml-0.5" />
                </div>

                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#FAF9F5] text-[#141413] border border-[#141413] font-mono text-[11px] font-bold">
                  [{vid.index}] {vid.category}
                </span>

                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#141413]/90 text-[#FAF9F5] border border-[#FAF9F5]/30 font-mono text-xs font-bold rounded">
                  {vid.duration}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#141413] mb-2 leading-snug">
                  {vid.title}
                </h3>
                <p className="text-sm text-[#5C5A54] leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <button
                onClick={() => onWatchVideo(vid)}
                className="brutal-btn w-full py-2.5 px-4 bg-[#D97757] text-[#141413] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Watch breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onExploreAll}
        className="brutal-btn w-full py-4 px-6 bg-[#FAF9F5] hover:bg-[#D97757] text-[#141413] rounded-xl flex items-center justify-between font-bold text-sm sm:text-base cursor-pointer"
      >
        <span className="inline-flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-[#141413] text-[#D97757] flex items-center justify-center">
            <Play className="w-4 h-4 fill-current" />
          </span>
          <span className="font-mono uppercase tracking-wider">
            {bottomCtaText}
          </span>
        </span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </section>
  );
};
