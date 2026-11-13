import React from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import {
  InstructorProfile,
  PillarItem,
  SiteSectionsConfig,
  SkillPill,
} from '../../types/course';

interface AdminSectionsPanelProps {
  profile: InstructorProfile;
  sections: SiteSectionsConfig;
  onUpdateProfile: (next: InstructorProfile) => void;
  onUpdateSections: (next: SiteSectionsConfig) => void;
  onNotify: (msg: string) => void;
}

export const AdminSectionsPanel: React.FC<AdminSectionsPanelProps> = ({
  profile,
  sections,
  onUpdateProfile,
  onUpdateSections,
  onNotify,
}) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateProfile({ ...profile, photoDataUrl: reader.result });
        onNotify('Instructor photo updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSiteIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateProfile({ ...profile, siteIconDataUrl: reader.result });
        onNotify('Website icon & favicon updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* 1. Top Marquee & Hero Promo Banner */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold">1. Top Marquee &amp; Hero Promo Banner</h3>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={profile.showTopMarquee}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, showTopMarquee: e.target.checked })
                }
                className="w-4 h-4 accent-[#D97757]"
              />
              Show Marquee
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={profile.showHeroPromo}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, showHeroPromo: e.target.checked })
                }
                className="w-4 h-4 accent-[#D97757]"
              />
              Show Dark Hero Banner
            </label>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase mb-1">
            Top Marquee Announcement Text (separate items with 3 spaces)
          </label>
          <input
            type="text"
            value={profile.promoBannerText}
            onChange={(e) =>
              onUpdateProfile({ ...profile, promoBannerText: e.target.value })
            }
            className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Brand / Site Name
            </label>
            <input
              type="text"
              value={profile.brandName}
              onChange={(e) =>
                onUpdateProfile({ ...profile, brandName: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>

          {/* Website Icon / Favicon Uploader */}
          <div className="flex items-center justify-between gap-3 p-3 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#141413] border border-[#141413] overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={profile.siteIconDataUrl || '/favicon.svg?v=3'}
                  alt="Site Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs truncate">
                  Website Icon &amp; Favicon
                </div>
                <div className="text-[11px] text-[#5C5A54]">
                  Browser tab + header logo
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <label className="px-3 py-1.5 bg-[#D97757] text-[#141413] border border-[#141413] rounded font-bold text-xs cursor-pointer">
                Upload Icon
                <input
                  type="file"
                  accept="image/*,.svg,.ico"
                  className="hidden"
                  onChange={handleSiteIconUpload}
                />
              </label>
              {profile.siteIconDataUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProfile({ ...profile, siteIconDataUrl: undefined });
                    onNotify('Reverted to default PCB trace icon.');
                  }}
                  className="px-2 py-1.5 border border-[#141413] rounded text-xs font-bold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Hero Top Pill Badge
            </label>
            <input
              type="text"
              value={profile.heroBadge}
              onChange={(e) =>
                onUpdateProfile({ ...profile, heroBadge: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Hero Display Headline
            </label>
            <input
              type="text"
              value={profile.heroTitle}
              onChange={(e) =>
                onUpdateProfile({ ...profile, heroTitle: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                Starburst Text
              </label>
              <input
                type="text"
                value={profile.heroStarburstText}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    heroStarburstText: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                Orange Box Text
              </label>
              <input
                type="text"
                value={profile.heroOfferBoxText}
                onChange={(e) =>
                  onUpdateProfile({
                    ...profile,
                    heroOfferBoxText: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase mb-1">
            Hero Subtitle
          </label>
          <textarea
            rows={2}
            value={profile.heroSubtitle}
            onChange={(e) =>
              onUpdateProfile({ ...profile, heroSubtitle: e.target.value })
            }
            className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Hero CTA Button Text
            </label>
            <input
              type="text"
              value={profile.heroCtaText}
              onChange={(e) =>
                onUpdateProfile({ ...profile, heroCtaText: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Hero Guarantee Line
            </label>
            <input
              type="text"
              value={profile.heroGuaranteeText}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  heroGuaranteeText: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. Instructor Hero & Animated Stats */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <h3 className="text-lg font-bold">2. Instructor Intro &amp; Live Stats</h3>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#141413] border-2 border-[#141413] overflow-hidden flex items-center justify-center">
              {profile.photoDataUrl ? (
                <img
                  src={profile.photoDataUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#D97757]" />
              )}
            </div>
            <div>
              <div className="font-bold text-sm">Instructor Portrait</div>
              <div className="text-xs text-[#5C5A54]">
                Appears in Hero &amp; Bio sections
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <label className="brutal-btn px-4 py-2 bg-[#D97757] text-[#141413] font-bold text-xs cursor-pointer">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            {profile.photoDataUrl && (
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({ ...profile, photoDataUrl: undefined })
                }
                className="px-3 py-2 border-2 border-[#141413] rounded text-xs font-bold cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Instructor Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                onUpdateProfile({ ...profile, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Greeting Headline
            </label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) =>
                onUpdateProfile({ ...profile, headline: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Primary CTA Text
            </label>
            <input
              type="text"
              value={profile.primaryCtaText}
              onChange={(e) =>
                onUpdateProfile({ ...profile, primaryCtaText: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase mb-1">
            Instructor Subheadline
          </label>
          <textarea
            rows={2}
            value={profile.subheadline}
            onChange={(e) =>
              onUpdateProfile({ ...profile, subheadline: e.target.value })
            }
            className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              Rating
            </label>
            <input
              type="text"
              value={profile.stats.rating}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  stats: { ...profile.stats, rating: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-bold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              Students Count
            </label>
            <input
              type="number"
              value={profile.stats.students}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  stats: {
                    ...profile.stats,
                    students: Number(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-bold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              PCBs Shipped
            </label>
            <input
              type="number"
              value={profile.stats.boardsShipped}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  stats: {
                    ...profile.stats,
                    boardsShipped: Number(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-bold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              Years Experience
            </label>
            <input
              type="number"
              value={profile.stats.yearsExp}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  stats: {
                    ...profile.stats,
                    yearsExp: Number(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* 3. Trust Strip (Tools & Ecosystem) */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold">3. Ecosystem / Trust Strip</h3>
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={sections.showTrustStrip}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  showTrustStrip: e.target.checked,
                })
              }
              className="w-4 h-4 accent-[#D97757]"
            />
            Show Section
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={sections.trustEyebrow}
            onChange={(e) =>
              onUpdateSections({ ...sections, trustEyebrow: e.target.value })
            }
            className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            placeholder="Eyebrow"
          />
          <input
            type="text"
            value={sections.trustHeading}
            onChange={(e) =>
              onUpdateSections({ ...sections, trustHeading: e.target.value })
            }
            className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            placeholder="Heading"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sections.ecosystem.map((eco) => (
            <div
              key={eco.id}
              className="p-3 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={eco.name}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      ecosystem: sections.ecosystem.map((x) =>
                        x.id === eco.id ? { ...x, name: e.target.value } : x
                      ),
                    })
                  }
                  className="w-full px-2 py-1 bg-[#FFFFFF] border border-[#141413] rounded text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSections({
                      ...sections,
                      ecosystem: sections.ecosystem.filter(
                        (x) => x.id !== eco.id
                      ),
                    })
                  }
                  className="text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={eco.sub}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    ecosystem: sections.ecosystem.map((x) =>
                      x.id === eco.id ? { ...x, sub: e.target.value } : x
                    ),
                  })
                }
                className="w-full px-2 py-1 bg-[#FFFFFF] border border-[#141413] rounded text-xs"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            onUpdateSections({
              ...sections,
              ecosystem: [
                ...sections.ecosystem,
                {
                  id: `eco-${Date.now()}`,
                  name: 'New Tool / Fab',
                  sub: 'Category',
                },
              ],
            })
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EEE6] border-2 border-[#141413] rounded text-xs font-bold cursor-pointer hover:bg-[#D97757]"
        >
          <Plus className="w-3.5 h-3.5" /> Add Ecosystem Item
        </button>
      </div>

      {/* 4. Core Pillars Section */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold">4. Core Pillar Cards</h3>
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={sections.showPillars}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  showPillars: e.target.checked,
                })
              }
              className="w-4 h-4 accent-[#D97757]"
            />
            Show Section
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={sections.pillarsEyebrow}
            onChange={(e) =>
              onUpdateSections({ ...sections, pillarsEyebrow: e.target.value })
            }
            className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
          />
          <input
            type="text"
            value={sections.pillarsHeading}
            onChange={(e) =>
              onUpdateSections({ ...sections, pillarsHeading: e.target.value })
            }
            className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.pillars.map((pil) => (
            <div
              key={pil.id}
              className="p-4 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg space-y-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pil.num}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      pillars: sections.pillars.map((p) =>
                        p.id === pil.id ? { ...p, num: e.target.value } : p
                      ),
                    })
                  }
                  className="w-14 px-2 py-1 bg-[#D97757] border border-[#141413] rounded text-xs font-mono font-bold text-center"
                />
                <select
                  value={pil.icon}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      pillars: sections.pillars.map((p) =>
                        p.id === pil.id
                          ? { ...p, icon: e.target.value as PillarItem['icon'] }
                          : p
                      ),
                    })
                  }
                  className="flex-1 px-2 py-1 bg-[#FFFFFF] border border-[#141413] rounded text-xs font-bold"
                >
                  <option value="cpu">Icon: CPU</option>
                  <option value="layers">Icon: Layers</option>
                  <option value="wrench">Icon: Wrench</option>
                </select>
              </div>
              <input
                type="text"
                value={pil.title}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    pillars: sections.pillars.map((p) =>
                      p.id === pil.id ? { ...p, title: e.target.value } : p
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-sm font-bold"
              />
              <textarea
                rows={3}
                value={pil.desc}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    pillars: sections.pillars.map((p) =>
                      p.id === pil.id ? { ...p, desc: e.target.value } : p
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Case Studies & Consultation Callout */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold">
            5. Engineering Case Studies &amp; Review Callout
          </h3>
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={sections.showCaseStudies}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  showCaseStudies: e.target.checked,
                })
              }
              className="w-4 h-4 accent-[#D97757]"
            />
            Show Section
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="p-4 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg space-y-2.5"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cs.badge}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      caseStudies: sections.caseStudies.map((x) =>
                        x.id === cs.id ? { ...x, badge: e.target.value } : x
                      ),
                    })
                  }
                  className="px-2 py-1 bg-[#FFFFFF] border border-[#141413] rounded text-xs font-mono font-bold"
                />
                <input
                  type="text"
                  value={cs.tag}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      caseStudies: sections.caseStudies.map((x) =>
                        x.id === cs.id ? { ...x, tag: e.target.value } : x
                      ),
                    })
                  }
                  className="px-2 py-1 bg-[#FFFFFF] border border-[#141413] rounded text-xs"
                />
              </div>
              <input
                type="text"
                value={cs.title}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    caseStudies: sections.caseStudies.map((x) =>
                      x.id === cs.id ? { ...x, title: e.target.value } : x
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-sm font-bold"
              />
              <textarea
                rows={2}
                value={cs.description}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    caseStudies: sections.caseStudies.map((x) =>
                      x.id === cs.id
                        ? { ...x, description: e.target.value }
                        : x
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-xs"
              />
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#FAF9F5] border-2 border-[#141413] rounded-lg space-y-3">
          <div className="font-mono text-xs font-bold uppercase text-[#C96442]">
            Dark Callout Banner
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={sections.callout.badge}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  callout: { ...sections.callout, badge: e.target.value },
                })
              }
              className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-xs font-bold"
            />
            <input
              type="text"
              value={sections.callout.ctaText}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  callout: { ...sections.callout, ctaText: e.target.value },
                })
              }
              className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-xs font-bold"
            />
          </div>
          <input
            type="text"
            value={sections.callout.headline}
            onChange={(e) =>
              onUpdateSections({
                ...sections,
                callout: { ...sections.callout, headline: e.target.value },
              })
            }
            className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-sm font-bold"
          />
          <textarea
            rows={2}
            value={sections.callout.description}
            onChange={(e) =>
              onUpdateSections({
                ...sections,
                callout: { ...sections.callout, description: e.target.value },
              })
            }
            className="w-full px-2.5 py-1.5 bg-[#FFFFFF] border border-[#141413] rounded text-xs"
          />
        </div>
      </div>

      {/* 6. Instructor Bio & Footer */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold">6. Instructor Bio &amp; Footer</h3>
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={sections.showBio}
              onChange={(e) =>
                onUpdateSections({ ...sections, showBio: e.target.checked })
              }
              className="w-4 h-4 accent-[#D97757]"
            />
            Show Bio Section
          </label>
        </div>

        <textarea
          rows={3}
          value={profile.bio}
          onChange={(e) =>
            onUpdateProfile({ ...profile, bio: e.target.value })
          }
          className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Tilted Sticker Badge Text
            </label>
            <input
              type="text"
              value={profile.stickerText}
              onChange={(e) =>
                onUpdateProfile({ ...profile, stickerText: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Footer Bottom Tagline
            </label>
            <input
              type="text"
              value={sections.footerTagline}
              onChange={(e) =>
                onUpdateSections({ ...sections, footerTagline: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        {/* Skill Pills */}
        <div>
          <label className="block font-mono text-xs font-bold uppercase mb-2">
            Bio Skill Pills
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sections.skillPills.map((pill) => (
              <div
                key={pill.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF9F5] border border-[#141413] rounded"
              >
                <input
                  type="text"
                  value={pill.label}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      skillPills: sections.skillPills.map((s) =>
                        s.id === pill.id ? { ...s, label: e.target.value } : s
                      ),
                    })
                  }
                  className="w-28 bg-transparent text-xs font-bold outline-none"
                />
                <select
                  value={pill.variant}
                  onChange={(e) =>
                    onUpdateSections({
                      ...sections,
                      skillPills: sections.skillPills.map((s) =>
                        s.id === pill.id
                          ? {
                              ...s,
                              variant: e.target.value as SkillPill['variant'],
                            }
                          : s
                      ),
                    })
                  }
                  className="text-[10px] bg-[#FFFFFF] border border-[#141413] rounded px-1"
                >
                  <option value="dark">Dark</option>
                  <option value="orange">Orange</option>
                  <option value="amber">Amber</option>
                  <option value="terracotta">Terracotta</option>
                  <option value="sand">Sand</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSections({
                      ...sections,
                      skillPills: sections.skillPills.filter(
                        (s) => s.id !== pill.id
                      ),
                    })
                  }
                  className="text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSections({
                ...sections,
                skillPills: [
                  ...sections.skillPills,
                  {
                    id: `sp-${Date.now()}`,
                    label: 'New Skill',
                    variant: 'orange',
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0EEE6] border border-[#141413] rounded text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill Pill
          </button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#E8E6DC]">
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              YouTube URL
            </label>
            <input
              type="text"
              value={sections.footerYoutubeUrl}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  footerYoutubeUrl: e.target.value,
                })
              }
              className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={sections.footerLinkedinUrl}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  footerLinkedinUrl: e.target.value,
                })
              }
              className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              value={sections.footerGithubUrl}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  footerGithubUrl: e.target.value,
                })
              }
              className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
