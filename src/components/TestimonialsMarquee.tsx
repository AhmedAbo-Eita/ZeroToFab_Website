import React from 'react';
import { Star } from 'lucide-react';
import { TestimonialItem } from '../types/course';
import { BrushUnderline } from './BrandMark';

interface TestimonialsMarqueeProps {
  heading: string;
  subheading: string;
  items: TestimonialItem[];
}

const TestimonialCard: React.FC<{ item: TestimonialItem }> = ({ item }) => (
  <div className="w-[320px] sm:w-[370px] shrink-0 bg-[#FAF9F5] border-2 border-[#141413] rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_#141413] mx-3 flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-[#D97757] text-[#D97757]"
          />
        ))}
      </div>
      <p className="text-sm sm:text-base text-[#141413] leading-relaxed mb-5">
        “{item.quote}”
      </p>
    </div>

    <div className="pt-3 border-t border-[#E8E6DC]">
      <div className="font-bold text-sm text-[#141413]">{item.name}</div>
      <div className="text-xs font-mono text-[#5C5A54]">{item.role}</div>
    </div>
  </div>
);

export const TestimonialsMarquee: React.FC<TestimonialsMarqueeProps> = ({
  heading,
  subheading,
  items,
}) => {
  if (items.length === 0) return null;
  const row1 = [...items, ...items];
  const row2 = [...items.slice().reverse(), ...items.slice().reverse()];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h2 className="brutal-display text-3xl sm:text-4xl lg:text-5xl text-[#141413]">
          <span className="relative inline-block">
            {heading}
            <BrushUnderline className="absolute left-0 -bottom-2 w-full h-3.5" />
          </span>
        </h2>
        <p className="text-[#5C5A54] mt-4 text-sm sm:text-base">
          {subheading}
        </p>
      </div>

      <div className="space-y-6">
        <div className="marquee-wrapper overflow-hidden py-2">
          <div className="animate-marquee-left">
            {row1.map((item, i) => (
              <TestimonialCard key={`r1-${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>

        <div className="marquee-wrapper overflow-hidden py-2">
          <div className="animate-marquee-right">
            {row2.map((item, i) => (
              <TestimonialCard key={`r2-${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
