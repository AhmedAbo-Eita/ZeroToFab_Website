import React from 'react';
import { CourseModule } from '../types/course';

export const CourseThumbnailSvg: React.FC<{
  theme: CourseModule['thumbnailTheme'];
  number: string;
}> = ({ theme, number }) => {
  return (
    <div className="relative w-full aspect-video bg-[#141413] overflow-hidden border-b-2 border-[#141413] pcb-grid-bg select-none">
      {/* Module Index Pill */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#D97757] text-[#141413] border-2 border-[#141413] font-mono text-xs font-bold shadow-[2px_2px_0px_#000]">
        MOD [{number}]
      </div>

      {theme === 'schematic' && (
        <svg viewBox="0 0 400 225" className="w-full h-full">
          {/* Op-amp & resistor schematic style */}
          <path d="M55 112 H125" stroke="#FAF9F5" strokeWidth="2.5" />
          <path d="M125 65 V160 L225 112.5 Z" fill="#1C1C1A" stroke="#D97757" strokeWidth="3" />
          <text x="140" y="95" fill="#FAF9F5" fontSize="14" fontFamily="monospace" fontWeight="bold">+</text>
          <text x="140" y="138" fill="#D97757" fontSize="14" fontFamily="monospace" fontWeight="bold">-</text>
          <path d="M225 112.5 H345" stroke="#FAF9F5" strokeWidth="2.5" />
          {/* Feedback loop */}
          <path d="M100 135 H125" stroke="#E5984B" strokeWidth="2.5" />
          <path d="M100 135 V42 H175" stroke="#E5984B" strokeWidth="2.5" fill="none" />
          <rect x="175" y="34" width="46" height="16" fill="#141413" stroke="#D97757" strokeWidth="2.5" />
          <path d="M221 42 H285 V112.5" stroke="#E5984B" strokeWidth="2.5" fill="none" />
          <circle cx="285" cy="112.5" r="5" fill="#D97757" />
          <circle cx="55" cy="112" r="5" fill="#FAF9F5" />
          <circle cx="345" cy="112.5" r="5" fill="#D97757" />
          <text x="275" y="198" fill="#B0AEA5" fontSize="11" fontFamily="monospace">ERC: 0 ERRORS</text>
        </svg>
      )}

      {theme === '4layer' && (
        <svg viewBox="0 0 400 225" className="w-full h-full">
          {/* QFN MCU package with differential traces */}
          <rect x="150" y="62" width="100" height="100" rx="6" fill="#1C1C1A" stroke="#D97757" strokeWidth="3" />
          <rect x="172" y="84" width="56" height="56" fill="#2A2926" stroke="#E5984B" strokeWidth="1.5" />
          <text x="177" y="116" fill="#FAF9F5" fontSize="12" fontFamily="monospace" fontWeight="bold">STM32</text>
          {/* Pins & Traces */}
          {[76, 94, 112, 130, 148].map((y, idx) => (
            <React.Fragment key={y}>
              <rect x="138" y={y - 3} width="12" height="6" fill="#E5984B" />
              <path
                d={`M138 ${y} H${95 - idx * 10} L${65 - idx * 8} ${y + 18}`}
                stroke={idx % 2 === 0 ? '#D97757' : '#FAF9F5'}
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx={65 - idx * 8} cy={y + 18} r="4" fill="#141413" stroke="#E5984B" strokeWidth="2" />
              <rect x="250" y={y - 3} width="12" height="6" fill="#E5984B" />
              <path
                d={`M262 ${y} H${305 + idx * 8} L${335 + idx * 6} ${y - 12}`}
                stroke={idx < 2 ? '#D97757' : '#B0AEA5'}
                strokeWidth="2.5"
                fill="none"
              />
            </React.Fragment>
          ))}
          <text x="260" y="198" fill="#E5984B" fontSize="11" fontFamily="monospace">L1/GND/GND/L4</text>
        </svg>
      )}

      {theme === 'power' && (
        <svg viewBox="0 0 400 225" className="w-full h-full">
          {/* Power pours & Inductor + Thermal Vias */}
          <path d="M40 50 H170 V115 H125 V175 H40 Z" fill="rgba(217,119,87,0.22)" stroke="#D97757" strokeWidth="2.5" />
          <path d="M230 50 H360 V175 H275 V115 H230 Z" fill="rgba(229,152,75,0.2)" stroke="#E5984B" strokeWidth="2.5" />
          {/* Switching Inductor */}
          <rect x="165" y="75" width="70" height="70" rx="8" fill="#1C1C1A" stroke="#FAF9F5" strokeWidth="3" />
          <text x="177" y="114" fill="#E5984B" fontSize="13" fontFamily="monospace" fontWeight="bold">4.7µH</text>
          {/* Thermal via matrix */}
          {[70, 90, 110].map((cx) =>
            [75, 95].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#141413" stroke="#E5984B" strokeWidth="2" />
            ))
          )}
          <text x="250" y="198" fill="#FAF9F5" fontSize="11" fontFamily="monospace">65W GaN · 2oz Cu</text>
        </svg>
      )}

      {theme === 'highspeed' && (
        <svg viewBox="0 0 400 225" className="w-full h-full">
          {/* Serpentine length-matched differential pair */}
          <path
            d="M30 85 H95 V55 H125 V115 H155 V55 H185 V115 H215 V85 H365"
            stroke="#D97757"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M30 103 H85 V73 H115 V133 H145 V73 H175 V133 H205 V103 H365"
            stroke="#E5984B"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Stitching return vias */}
          {[250, 290, 330].map((vx) => (
            <React.Fragment key={vx}>
              <circle cx={vx} cy="64" r="5" fill="#141413" stroke="#FAF9F5" strokeWidth="2" />
              <circle cx={vx} cy="124" r="5" fill="#141413" stroke="#FAF9F5" strokeWidth="2" />
            </React.Fragment>
          ))}
          <text x="34" y="198" fill="#D97757" fontSize="11" fontFamily="monospace">100Ω DIFF · ΔL &lt; 0.1mm</text>
        </svg>
      )}

      {theme === 'rf' && (
        <svg viewBox="0 0 400 225" className="w-full h-full">
          {/* PCB Meander Antenna + Pi matching + Via Fence */}
          <path
            d="M40 130 H190"
            stroke="#D97757"
            strokeWidth="5"
          />
          {/* Via fence */}
          {[60, 85, 110, 135, 160].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="108" r="4" fill="#141413" stroke="#E5984B" strokeWidth="2" />
              <circle cx={x} cy="152" r="4" fill="#141413" stroke="#E5984B" strokeWidth="2" />
            </React.Fragment>
          ))}
          {/* Meander Antenna Keepout */}
          <rect x="200" y="42" width="160" height="136" stroke="#FAF9F5" strokeDasharray="5 4" strokeWidth="1.5" fill="rgba(217,119,87,0.08)" />
          <path
            d="M190 130 H225 V70 H255 V130 H285 V70 H315 V130 H340"
            stroke="#E5984B"
            strokeWidth="4"
            fill="none"
          />
          <text x="215" y="198" fill="#FAF9F5" fontSize="11" fontFamily="monospace">2.4GHz CPWG · 50Ω</text>
        </svg>
      )}

      {theme === 'dfm' && (
        <svg viewBox="0 0 400 225" className="w-full h-full">
          {/* Panelized V-score PCB with fiducials */}
          <rect x="55" y="42" width="290" height="140" rx="4" fill="#1C1C1A" stroke="#FAF9F5" strokeWidth="2" />
          <line x1="200" y1="32" x2="200" y2="192" stroke="#D97757" strokeDasharray="6 4" strokeWidth="2" />
          <rect x="75" y="60" width="108" height="104" fill="#252422" stroke="#E5984B" strokeWidth="2" />
          <rect x="217" y="60" width="108" height="104" fill="#252422" stroke="#E5984B" strokeWidth="2" />
          {/* Fiducials */}
          <circle cx="65" cy="52" r="4.5" fill="#E5984B" />
          <circle cx="335" cy="52" r="4.5" fill="#E5984B" />
          <circle cx="65" cy="172" r="4.5" fill="#E5984B" />
          <text x="94" y="116" fill="#FAF9F5" fontSize="11" fontFamily="monospace">UNIT A</text>
          <text x="236" y="116" fill="#FAF9F5" fontSize="11" fontFamily="monospace">UNIT B</text>
          <text x="242" y="205" fill="#D97757" fontSize="11" fontFamily="monospace">GERBER X2 + CPL</text>
        </svg>
      )}
    </div>
  );
};

export const CaseStudyBlueprint: React.FC<{ variant: 'stackup' | 'gan' }> = ({
  variant,
}) => {
  if (variant === 'stackup') {
    return (
      <svg viewBox="0 0 460 220" className="w-full h-auto rounded-lg bg-[#141413] border-2 border-[#141413]">
        <rect width="460" height="220" fill="#141413" />
        {/* 6-Layer Cross Section */}
        <text x="20" y="26" fill="#D97757" fontSize="11" fontFamily="monospace" fontWeight="bold">
          6-LAYER CONTROLLED IMPEDANCE STACKUP (1.6MM)
        </text>
        {[
          { y: 44, h: 14, label: 'L1 · SIG / DIFF (50Ω / 90Ω)', color: '#D97757', text: '#141413' },
          { y: 62, h: 12, label: 'L2 · SOLID GND PLANE', color: '#E5984B', text: '#141413' },
          { y: 84, h: 12, label: 'L3 · INNER HIGH-SPEED', color: '#FAF9F5', text: '#141413' },
          { y: 110, h: 12, label: 'L4 · POWER / 3V3 / 1V2', color: '#C96442', text: '#FAF9F5' },
          { y: 132, h: 12, label: 'L5 · SOLID GND PLANE', color: '#E5984B', text: '#141413' },
          { y: 150, h: 14, label: 'L6 · SIG / LOW-SPEED', color: '#D97757', text: '#141413' },
        ].map((layer) => (
          <g key={layer.label}>
            <rect x="24" y={layer.y} width="260" height={layer.h} fill={layer.color} />
            <text x="296" y={layer.y + 10} fill="#E8E6DC" fontSize="10" fontFamily="monospace">
              {layer.label}
            </text>
          </g>
        ))}
        {/* Via barrel stitching L2-L5 */}
        <rect x="248" y="42" width="10" height="124" fill="#141413" stroke="#FAF9F5" strokeWidth="1.5" />
        <text x="20" y="198" fill="#B0AEA5" fontSize="10" fontFamily="monospace">
          Dielectric 2116 Prepreg · Dk = 4.2 · 0.11mm Coupling
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 460 220" className="w-full h-auto rounded-lg bg-[#141413] border-2 border-[#141413]">
      <rect width="460" height="220" fill="#141413" />
      <text x="20" y="26" fill="#E5984B" fontSize="11" fontFamily="monospace" fontWeight="bold">
        65W GaN BUCK · HOT-LOOP REDUCTION (-22 dB EMI)
      </text>
      {/* Before loop (dashed large) */}
      <rect
        x="30"
        y="46"
        width="180"
        height="118"
        rx="6"
        fill="rgba(201,100,66,0.12)"
        stroke="#C96442"
        strokeDasharray="5 4"
        strokeWidth="2"
      />
      <text x="42" y="68" fill="#C96442" fontSize="10" fontFamily="monospace">
        BEFORE: 420 mm² LOOP
      </text>
      <text x="42" y="148" fill="#B0AEA5" fontSize="10" fontFamily="monospace">
        FAILED @ 180MHz (+9dB)
      </text>

      {/* Arrow */}
      <path d="M222 105 H254 M246 98 L254 105 L246 112" stroke="#FAF9F5" strokeWidth="2.5" fill="none" />

      {/* After loop (compact terracotta) */}
      <rect
        x="268"
        y="46"
        width="164"
        height="118"
        rx="6"
        fill="rgba(217,119,87,0.18)"
        stroke="#D97757"
        strokeWidth="2.5"
      />
      <rect x="308" y="82" width="84" height="44" rx="4" fill="#D97757" stroke="#FAF9F5" strokeWidth="2" />
      <text x="318" y="108" fill="#141413" fontSize="11" fontFamily="monospace" fontWeight="bold">
        38 mm²
      </text>
      <text x="280" y="68" fill="#E5984B" fontSize="10" fontFamily="monospace">
        AFTER: CIN ADJACENT
      </text>
      <text x="280" y="148" fill="#FAF9F5" fontSize="10" fontFamily="monospace">
        PASSED CISPR-32 (-13dB)
      </text>
      <text x="20" y="198" fill="#B0AEA5" fontSize="10" fontFamily="monospace">
        Solid L2 Return Plane Directly Under SW Node
      </text>
    </svg>
  );
};
