import React from 'react';

interface TopMarqueeProps {
  text: string;
}

export const TopMarquee: React.FC<TopMarqueeProps> = ({ text }) => {
  const items = text.split('   ').filter(Boolean);
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full bg-[#D97757] text-[#141413] border-b-2 border-[#141413] overflow-hidden marquee-wrapper select-none">
      <div className="animate-marquee-left py-2">
        {repeated.map((chunk, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-4 px-4 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap"
          >
            <span>{chunk}</span>
            <span className="font-mono text-[#141413]/75">+</span>
          </span>
        ))}
      </div>
    </div>
  );
};
