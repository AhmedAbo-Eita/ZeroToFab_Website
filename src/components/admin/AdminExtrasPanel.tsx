import React from 'react';
import {
  Download,
  HardDrive,
  Lock,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  AdminSecurityConfig,
  CourseModule,
  FullSiteState,
  GoogleDriveConfig,
  LabVideoItem,
  MasterclassItem,
  SiteSectionsConfig,
  TestimonialItem,
} from '../../types/course';
import { extractGoogleDriveFileId } from '../../utils/googleDrive';

interface AdminExtrasPanelProps {
  mode: 'masterclasses' | 'testimonials' | 'lab' | 'settings';
  state: FullSiteState;
  courses: CourseModule[];
  onUpdateState: (patch: Partial<FullSiteState>) => void;
  onUpdateSections: (next: SiteSectionsConfig) => void;
  onResetDefaults: () => void;
  onNotify: (msg: string) => void;
}

export const AdminExtrasPanel: React.FC<AdminExtrasPanelProps> = ({
  mode,
  state,
  courses,
  onUpdateState,
  onUpdateSections,
  onResetDefaults,
  onNotify,
}) => {
  const {
    sections,
    masterclasses,
    testimonials,
    labVideos,
    driveConfig,
    security,
  } = state;

  if (mode === 'masterclasses') {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-bold">Masterclasses Section</h3>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={sections.showMasterclasses}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    showMasterclasses: e.target.checked,
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
              value={sections.masterclassesEyebrow}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  masterclassesEyebrow: e.target.value,
                })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
            <input
              type="text"
              value={sections.masterclassesHeading}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  masterclassesHeading: e.target.value,
                })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        {masterclasses.map((mc) => (
          <div
            key={mc.id}
            className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#D97757] border border-[#141413] rounded">
                MASTERCLASS
              </span>
              <button
                type="button"
                onClick={() => {
                  onUpdateState({
                    masterclasses: masterclasses.filter((m) => m.id !== mc.id),
                  });
                  onNotify('Masterclass deleted.');
                }}
                className="text-red-700 p-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={mc.title}
                onChange={(e) =>
                  onUpdateState({
                    masterclasses: masterclasses.map((m) =>
                      m.id === mc.id ? { ...m, title: e.target.value } : m
                    ),
                  })
                }
                placeholder="Title"
                className="md:col-span-2 px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-bold"
              />
              <input
                type="text"
                value={mc.badge}
                onChange={(e) =>
                  onUpdateState({
                    masterclasses: masterclasses.map((m) =>
                      m.id === mc.id ? { ...m, badge: e.target.value } : m
                    ),
                  })
                }
                placeholder="Badge"
                className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-xs font-mono"
              />
            </div>

            <textarea
              rows={2}
              value={mc.description}
              onChange={(e) =>
                onUpdateState({
                  masterclasses: masterclasses.map((m) =>
                    m.id === mc.id ? { ...m, description: e.target.value } : m
                  ),
                })
              }
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  min={0}
                  value={mc.price}
                  onChange={(e) =>
                    onUpdateState({
                      masterclasses: masterclasses.map((m) =>
                        m.id === mc.id
                          ? { ...m, price: Number(e.target.value) || 0 }
                          : m
                      ),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#141413] rounded text-sm font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={mc.duration}
                  onChange={(e) =>
                    onUpdateState({
                      masterclasses: masterclasses.map((m) =>
                        m.id === mc.id ? { ...m, duration: e.target.value } : m
                      ),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#141413] rounded text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                  Linked Module
                </label>
                <select
                  value={mc.linkedModuleId}
                  onChange={(e) =>
                    onUpdateState({
                      masterclasses: masterclasses.map((m) =>
                        m.id === mc.id
                          ? { ...m, linkedModuleId: e.target.value }
                          : m
                      ),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#141413] rounded text-xs font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.number}] {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold uppercase mb-1">
                Bullet Points (one per line)
              </label>
              <textarea
                rows={3}
                value={mc.bullets.join('\n')}
                onChange={(e) =>
                  onUpdateState({
                    masterclasses: masterclasses.map((m) =>
                      m.id === mc.id
                        ? { ...m, bullets: e.target.value.split('\n') }
                        : m
                    ),
                  })
                }
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            const newMc: MasterclassItem = {
              id: `mc-${Date.now()}`,
              title: 'New Focused PCB Intensive',
              badge: 'INTENSIVE · 3 HOURS',
              description: 'Hands-on live deep dive into specialized PCB layout.',
              bullets: ['Full source files included', 'Live DRC walkthrough'],
              price: 49,
              duration: '3h 00m',
              linkedModuleId: courses[0]?.id || '',
            };
            onUpdateState({ masterclasses: [...masterclasses, newMc] });
            onNotify('Added new Masterclass.');
          }}
          className="brutal-btn px-5 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Masterclass
        </button>
      </div>
    );
  }

  if (mode === 'testimonials') {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-bold">Testimonials Marquee</h3>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={sections.showTestimonials}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    showTestimonials: e.target.checked,
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
              value={sections.testimonialsHeading}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  testimonialsHeading: e.target.value,
                })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
            <input
              type="text"
              value={sections.testimonialsSubheading}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  testimonialsSubheading: e.target.value,
                })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-5 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_#141413] space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) =>
                    onUpdateState({
                      testimonials: testimonials.map((x) =>
                        x.id === t.id ? { ...x, name: e.target.value } : x
                      ),
                    })
                  }
                  className="font-bold text-sm px-2 py-1 bg-[#FAF9F5] border border-[#141413] rounded flex-1"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateState({
                      testimonials: testimonials.filter((x) => x.id !== t.id),
                    })
                  }
                  className="text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={t.role}
                onChange={(e) =>
                  onUpdateState({
                    testimonials: testimonials.map((x) =>
                      x.id === t.id ? { ...x, role: e.target.value } : x
                    ),
                  })
                }
                className="w-full text-xs px-2 py-1 bg-[#FAF9F5] border border-[#141413] rounded"
              />
              <textarea
                rows={3}
                value={t.quote}
                onChange={(e) =>
                  onUpdateState({
                    testimonials: testimonials.map((x) =>
                      x.id === t.id ? { ...x, quote: e.target.value } : x
                    ),
                  })
                }
                className="w-full text-xs px-2 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const next: TestimonialItem = {
              id: `t-${Date.now()}`,
              name: 'New Student',
              role: 'Hardware Engineer',
              quote: 'Practical lessons that helped me ship my first 4-layer board.',
              rating: 5,
            };
            onUpdateState({ testimonials: [...testimonials, next] });
            onNotify('Added testimonial.');
          }}
          className="brutal-btn px-5 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>
    );
  }

  if (mode === 'lab') {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-bold">Hardware Lab Videos Section</h3>
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={sections.showLabVideos}
                onChange={(e) =>
                  onUpdateSections({
                    ...sections,
                    showLabVideos: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#D97757]"
              />
              Show Section
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={sections.labEyebrow}
              onChange={(e) =>
                onUpdateSections({ ...sections, labEyebrow: e.target.value })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
            <input
              type="text"
              value={sections.labHeading}
              onChange={(e) =>
                onUpdateSections({ ...sections, labHeading: e.target.value })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
            <input
              type="text"
              value={sections.labBottomCtaText}
              onChange={(e) =>
                onUpdateSections({
                  ...sections,
                  labBottomCtaText: e.target.value,
                })
              }
              className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labVideos.map((vid) => (
            <div
              key={vid.id}
              className="p-5 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[3px_3px_0px_#141413] space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={vid.category}
                  onChange={(e) =>
                    onUpdateState({
                      labVideos: labVideos.map((v) =>
                        v.id === vid.id
                          ? { ...v, category: e.target.value }
                          : v
                      ),
                    })
                  }
                  className="px-2 py-1 bg-[#D97757] border border-[#141413] rounded text-[11px] font-mono font-bold w-40"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateState({
                      labVideos: labVideos.filter((v) => v.id !== vid.id),
                    })
                  }
                  className="text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={vid.title}
                onChange={(e) =>
                  onUpdateState({
                    labVideos: labVideos.map((v) =>
                      v.id === vid.id ? { ...v, title: e.target.value } : v
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-sm font-bold"
              />
              <textarea
                rows={2}
                value={vid.description}
                onChange={(e) =>
                  onUpdateState({
                    labVideos: labVideos.map((v) =>
                      v.id === vid.id
                        ? { ...v, description: e.target.value }
                        : v
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={vid.duration}
                  onChange={(e) =>
                    onUpdateState({
                      labVideos: labVideos.map((v) =>
                        v.id === vid.id
                          ? { ...v, duration: e.target.value }
                          : v
                      ),
                    })
                  }
                  placeholder="24:10"
                  className="px-2 py-1 bg-[#FAF9F5] border border-[#141413] rounded text-xs font-mono"
                />
                <select
                  value={vid.linkedModuleId || ''}
                  onChange={(e) =>
                    onUpdateState({
                      labVideos: labVideos.map((v) =>
                        v.id === vid.id
                          ? { ...v, linkedModuleId: e.target.value }
                          : v
                      ),
                    })
                  }
                  className="px-2 py-1 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      MOD {c.number}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={vid.driveFileId || ''}
                onChange={(e) => {
                  const id = extractGoogleDriveFileId(e.target.value) || e.target.value;
                  onUpdateState({
                    labVideos: labVideos.map((v) =>
                      v.id === vid.id ? { ...v, driveFileId: id } : v
                    ),
                  });
                }}
                placeholder="Optional Google Drive Link / File ID"
                className="w-full px-2 py-1 bg-[#FAF9F5] border border-[#141413] rounded text-xs"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const next: LabVideoItem = {
              id: `lab-${Date.now()}`,
              index: String(labVideos.length + 1).padStart(2, '0'),
              category: 'LAB DEMO',
              title: 'New Hardware Lab Breakdown',
              description: 'Hands-on schematic and oscilloscope walkthrough.',
              duration: '19:30',
              linkedModuleId: courses[0]?.id,
            };
            onUpdateState({ labVideos: [...labVideos, next] });
            onNotify('Added Lab Video card.');
          }}
          className="brutal-btn px-5 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Lab Video
        </button>
      </div>
    );
  }

  // Settings, Google Drive Integration, Security & Backup JSON
  const updateDrive = (patch: Partial<GoogleDriveConfig>) =>
    onUpdateState({ driveConfig: { ...driveConfig, ...patch } });
  const updateSec = (patch: Partial<AdminSecurityConfig>) =>
    onUpdateState({ security: { ...security, ...patch } });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pcb-masterclass-site-config.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onNotify('Exported full site configuration JSON!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<FullSiteState>;
        onUpdateState(parsed);
        onNotify('Imported full site configuration!');
      } catch {
        onNotify('Invalid JSON configuration file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Google Drive On-Demand Video Configuration */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#C96442]" />
          <span>Google Drive Video Hosting &amp; On-Demand Streaming</span>
        </h3>
        <p className="text-sm text-[#5C5A54] leading-relaxed">
          Videos linked or uploaded to Google Drive are <strong>not loaded
          until a student clicks &quot;Request &amp; Load Video&quot;</strong>.
          You can paste any Google Drive share link directly when adding a
          lesson, OR add a Google OAuth Client ID below to upload MP4 files
          directly from this dashboard into your Google Drive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Google OAuth Client ID (for Direct Upload)
            </label>
            <input
              type="text"
              value={driveConfig.clientId}
              onChange={(e) => updateDrive({ clientId: e.target.value })}
              placeholder="1234567890-xxxx.apps.googleusercontent.com"
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-bold uppercase mb-1">
              Target Google Drive Folder ID (optional)
            </label>
            <input
              type="text"
              value={driveConfig.folderId}
              onChange={(e) => updateDrive({ folderId: e.target.value })}
              placeholder="1AbCDefGhIjkLmNoPqRs..."
              className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase mb-1">
            Optional Backend Stream Proxy URL (for private Drive files)
          </label>
          <input
            type="text"
            value={driveConfig.proxyBaseUrl}
            onChange={(e) => updateDrive({ proxyBaseUrl: e.target.value })}
            placeholder="https://api.yoursite.com/drive-stream"
            className="w-full px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm"
          />
          <p className="text-[11px] text-[#5C5A54] mt-1">
            Leave blank to use Google Drive’s native on-demand preview player.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={driveConfig.defaultOnDemand}
            onChange={(e) => updateDrive({ defaultOnDemand: e.target.checked })}
            className="w-4 h-4 accent-[#D97757]"
          />
          Require student click (&quot;Request &amp; Load Video&quot;) by default for all Google Drive lessons
        </label>
      </div>

      {/* Admin Passcode Protection */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#C96442]" />
          <span>Admin Dashboard Passcode Lock</span>
        </h3>

        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={security.passcodeEnabled}
              onChange={(e) => updateSec({ passcodeEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#D97757]"
            />
            Require passcode when opening /admin
          </label>

          <input
            type="text"
            value={security.passcode}
            onChange={(e) => updateSec({ passcode: e.target.value })}
            placeholder="Passcode"
            className="px-3 py-2 bg-[#FAF9F5] border-2 border-[#141413] rounded text-sm font-mono"
          />
        </div>
      </div>

      {/* Export / Import / Reset */}
      <div className="p-6 bg-[#FFFFFF] border-2 border-[#141413] rounded-xl shadow-[4px_4px_0px_#141413] space-y-4">
        <h3 className="text-lg font-bold">Full Website Backup &amp; Reset</h3>
        <p className="text-sm text-[#5C5A54]">
          Export every section, course, price, Google Drive file ID, and
          testimonial as JSON, or import a saved backup.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="brutal-btn px-5 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Full Site JSON</span>
          </button>

          <label className="brutal-btn px-5 py-2.5 bg-[#FAF9F5] text-[#141413] font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Site JSON</span>
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              onResetDefaults();
              onNotify('Restored all sections & courses to defaults.');
            }}
            className="px-4 py-2.5 border-2 border-[#141413] rounded font-bold text-sm inline-flex items-center gap-2 hover:bg-[#141413] hover:text-[#FAF9F5] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
