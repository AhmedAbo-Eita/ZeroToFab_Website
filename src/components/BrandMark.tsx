import React from 'react';
import { motion } from 'framer-motion';

export const BrandMark: React.FC<{
  dark?: boolean;
  className?: string;
  customIconUrl?: string;
}> = ({ dark = false, className = 'w-9 h-9', customIconUrl }) => {
  if (customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt="Website Icon"
        className={`${className} object-contain rounded-lg border-2 ${
          dark ? 'border-[#FAF9F5]/40' : 'border-[#141413]'
        }`}
      />
    );
  }

  const outline = dark ? '#FAF9F5' : '#141413';
  const topFaceFill = dark ? '#262522' : '#1C1C1A';
  const topSkirtFill = dark ? '#1C1C1A' : '#141413';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="ZeroToFab 4-Layer PCB Stackup Brand Mark"
    >
      {/* Layer 4 (Bottom): Terracotta */}
      <path
        d="M9 40 C9 38.5 10.5 37.5 12 36.8 L29 29.2 C31 28.3 33 28.3 35 29.2 L52 36.8 C53.5 37.5 55 38.5 55 40 V44.5 C55 46 53.5 47 52 47.7 L35 55.3 C33 56.2 31 56.2 29 55.3 L12 47.7 C10.5 47 9 46 9 44.5 Z"
        fill="#C96442"
        stroke={outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 39.5 L29.5 30.8 C31.1 30.1 32.9 30.1 34.5 30.8 L54 39.5 L34.5 48.2 C32.9 48.9 31.1 48.9 29.5 48.2 Z"
        fill="#D97757"
        stroke={outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Layer 3: Copper Gold */}
      <path
        d="M9 33 C9 31.5 10.5 30.5 12 29.8 L29 22.2 C31 21.3 33 21.3 35 22.2 L52 29.8 C53.5 30.5 55 31.5 55 33 V37.5 C55 39 53.5 40 52 40.7 L35 48.3 C33 49.2 31 49.2 29 48.3 L12 40.7 C10.5 40 9 39 9 37.5 Z"
        fill="#D48436"
        stroke={outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 32.5 L29.5 23.8 C31.1 23.1 32.9 23.1 34.5 23.8 L54 32.5 L34.5 41.2 C32.9 41.9 31.1 41.9 29.5 41.2 Z"
        fill="#E5984B"
        stroke={outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Layer 2: Parchment Cream */}
      <path
        d="M9 26 C9 24.5 10.5 23.5 12 22.8 L29 15.2 C31 14.3 33 14.3 35 15.2 L52 22.8 C53.5 23.5 55 24.5 55 26 V30.5 C55 32 53.5 33 52 33.7 L35 41.3 C33 42.2 31 42.2 29 41.3 L12 33.7 C10.5 33 9 32 9 30.5 Z"
        fill="#E8E6DC"
        stroke={outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 25.5 L29.5 16.8 C31.1 16.1 32.9 16.1 34.5 16.8 L54 25.5 L34.5 34.2 C32.9 34.9 31.1 34.9 29.5 34.2 Z"
        fill="#FAF9F5"
        stroke={outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Layer 1 (Top): Charcoal */}
      <path
        d="M9 19 C9 17.5 10.5 16.5 12 15.8 L29 8.2 C31 7.3 33 7.3 35 8.2 L52 15.8 C53.5 16.5 55 17.5 55 19 V23.5 C55 25 53.5 26 52 26.7 L35 34.3 C33 35.2 31 35.2 29 34.3 L12 26.7 C10.5 26 9 25 9 23.5 Z"
        fill={topSkirtFill}
        stroke={outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.5 L29.5 9.8 C31.1 9.1 32.9 9.1 34.5 9.8 L54 18.5 L34.5 27.2 C32.9 27.9 31.1 27.9 29.5 27.2 Z"
        fill={topFaceFill}
        stroke={outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Center Plated-Through Copper Via */}
      <ellipse
        cx="32"
        cy="18.5"
        rx="8.2"
        ry="4.4"
        fill="#E5984B"
        stroke="#141413"
        strokeWidth="1.6"
      />
      <ellipse cx="32" cy="18.5" rx="4.2" ry="2.2" fill="#141413" />
    </svg>
  );
};

export const BrushUnderline: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#D97757' }) => {
  return (
    <svg
      viewBox="0 0 220 18"
      fill="none"
      preserveAspectRatio="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <motion.path
        d="M3 12.5C45 5.5 142 3.5 217 9.5"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
};

export const EyebrowBrick: React.FC<{
  label: string;
  dark?: boolean;
}> = ({ label, dark = false }) => (
  <div className="inline-flex items-center gap-2.5 mb-4">
    <span
      className="inline-block w-3.5 h-3.5 bg-[#D97757] border-2 border-[#141413] shrink-0"
      style={{ borderColor: dark ? '#FAF9F5' : '#141413' }}
    />
    <span
      className={`font-mono text-xs font-bold uppercase tracking-[0.14em] ${
        dark ? 'text-[#E8E6DC]' : 'text-[#141413]'
      }`}
    >
      {label}
    </span>
  </div>
);
