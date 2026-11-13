import React from 'react';
import { Youtube, Linkedin, Github } from 'lucide-react';
import { SiteSectionsConfig } from '../types/course';
import { BrandMark } from './BrandMark';

interface FooterProps {
  brandName: string;
  siteIconUrl?: string;
  sections: SiteSectionsConfig;
  onOpenCurriculum: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  brandName,
  siteIconUrl,
  sections,
  onOpenCurriculum,
}) => {
  return (
    <footer className="w-full bg-[#141413] text-[#FAF9F5] border-t-2 border-[#141413] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2E2D2A]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandMark dark customIconUrl={siteIconUrl} className="w-8 h-8" />
              <span className="font-bold text-lg tracking-tight">
                {brandName}
              </span>
            </div>
            <p className="text-sm text-[#B0AEA5] leading-relaxed mb-5">
              {sections.footerSlogan}
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { icon: Youtube, label: 'YouTube', href: sections.footerYoutubeUrl },
                { icon: Linkedin, label: 'LinkedIn', href: sections.footerLinkedinUrl },
                { icon: Github, label: 'GitHub', href: sections.footerGithubUrl },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href || '#top'}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded border border-[#2E2D2A] hover:border-[#D97757] hover:bg-[#D97757] hover:text-[#141413] flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97757] mb-4">
              Tracks
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B0AEA5]">
              <li>
                <a href="#curriculum" className="hover:text-[#FAF9F5] transition-colors">
                  Beginner: Schematics &amp; 2-Layer
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-[#FAF9F5] transition-colors">
                  Intermediate: 4-Layer &amp; Power
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-[#FAF9F5] transition-colors">
                  Advanced: DDR4 &amp; High-Speed
                </a>
              </li>
              <li>
                <a href="#masterclasses" className="hover:text-[#FAF9F5] transition-colors">
                  Weekend Intensives
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97757] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B0AEA5]">
              <li>
                <button
                  onClick={onOpenCurriculum}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Browse Full Curriculum
                </button>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-[#FAF9F5] transition-colors">
                  Engineering Case Studies
                </a>
              </li>
              <li>
                <a href="#lab-videos" className="hover:text-[#FAF9F5] transition-colors">
                  Hardware Lab Teardowns
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FAF9F5] transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97757] mb-4">
              Engineering Standards
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B0AEA5]">
              <li>IPC-2221 &amp; IPC-7351 Rules</li>
              <li>Gerber X2 &amp; ODB++ Outputs</li>
              <li>Impedance Stackup Templates</li>
              <li>Lab Bring-Up Checklists</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B0AEA5]">
          <span>
            © {new Date().getFullYear()} {brandName}. {sections.footerCopyright}
          </span>
          <span className="font-mono text-[#D97757]">
            {sections.footerTagline}
          </span>
        </div>
      </div>
    </footer>
  );
};
