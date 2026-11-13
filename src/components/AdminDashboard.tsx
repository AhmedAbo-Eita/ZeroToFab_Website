import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Lock,
  MessageSquareQuote,
  PlaySquare,
  Settings,
  Sparkles,
} from 'lucide-react';
import {
  CourseModule,
  FullSiteState,
  InstructorProfile,
  SiteSectionsConfig,
} from '../types/course';
import { BrandMark } from './BrandMark';
import { AdminCoursesPanel } from './admin/AdminCoursesPanel';
import { AdminSectionsPanel } from './admin/AdminSectionsPanel';
import { AdminExtrasPanel } from './admin/AdminExtrasPanel';

interface AdminDashboardProps {
  state: FullSiteState;
  onUpdateState: (patch: Partial<FullSiteState>) => void;
  onResetDefaults: () => void;
  onGoToPublicSite: () => void;
}

type AdminTab =
  | 'courses'
  | 'sections'
  | 'masterclasses'
  | 'testimonials'
  | 'lab'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  state,
  onUpdateState,
  onResetDefaults,
  onGoToPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('courses');
  const [toast, setToast] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<boolean>(
    !state.security.passcodeEnabled
  );
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  if (!unlocked && state.security.passcodeEnabled) {
    return (
      <div className="min-h-screen bg-[#141413] text-[#FAF9F5] flex items-center justify-center p-4 pcb-grid-bg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pinInput === state.security.passcode) {
              setUnlocked(true);
              setPinError(false);
            } else {
              setPinError(true);
            }
          }}
          className="w-full max-w-md bg-[#FAF9F5] text-[#141413] border-[3px] border-[#141413] rounded-2xl p-8 shadow-[8px_8px_0px_#D97757] space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#D97757] border-2 border-[#141413] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Admin Dashboard Locked</h1>
              <p className="font-mono text-xs text-[#5C5A54]">
                Enter your dashboard passcode
              </p>
            </div>
          </div>

          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Passcode"
            className="w-full px-4 py-3 bg-[#FFFFFF] border-2 border-[#141413] rounded-lg font-mono text-sm"
            autoFocus
          />

          {pinError && (
            <p className="text-xs font-bold text-red-700">
              Incorrect passcode. Try again.
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onGoToPublicSite}
              className="px-4 py-2.5 border-2 border-[#141413] rounded font-bold text-xs cursor-pointer"
            >
              ← Back to Website
            </button>
            <button
              type="submit"
              className="brutal-btn px-6 py-2.5 bg-[#D97757] text-[#141413] font-bold text-sm cursor-pointer"
            >
              Unlock Admin
            </button>
          </div>
        </form>
      </div>
    );
  }

  const NAV: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'courses', label: 'Courses, Pricing & Drive Upload', icon: BookOpen },
    { id: 'sections', label: 'All Page Sections & Hero', icon: Layers },
    { id: 'masterclasses', label: 'Masterclasses', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'lab', label: 'Hardware Lab Videos', icon: PlaySquare },
    { id: 'settings', label: 'Google Drive & Settings', icon: Settings },
  ];

  const handleUpdateCourses = (next: CourseModule[]) =>
    onUpdateState({ courses: next });
  const handleUpdateProfile = (next: InstructorProfile) =>
    onUpdateState({ profile: next });
  const handleUpdateSections = (next: SiteSectionsConfig) =>
    onUpdateState({ sections: next });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#141413] text-[#FAF9F5] border-b-[3px] border-[#D97757] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BrandMark
            dark
            customIconUrl={state.profile.siteIconDataUrl}
            className="w-8 h-8"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight">
                {state.profile.brandName}
              </span>
              <span className="px-2 py-0.5 bg-[#D97757] text-[#141413] font-mono text-[10px] font-bold rounded">
                ADMIN CMS
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline font-mono text-xs text-[#B0AEA5]">
            Changes save automatically
          </span>
          <button
            onClick={onGoToPublicSite}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D97757] hover:bg-[#E87A54] text-[#141413] font-bold text-xs sm:text-sm rounded border-2 border-[#FAF9F5] shadow-[3px_3px_0px_#FAF9F5] cursor-pointer"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2 h-fit lg:sticky lg:top-24">
          <div className="p-4 bg-[#141413] text-[#FAF9F5] rounded-xl border-2 border-[#141413] mb-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#D97757] font-bold mb-1">
              <LayoutDashboard className="w-4 h-4" />
              <span>SITE CONTROL CENTER</span>
            </div>
            <p className="text-xs text-[#B0AEA5] leading-relaxed">
              Manage courses, pricing, Google Drive videos, and every section on
              your site.
            </p>
          </div>

          <nav className="space-y-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 border-[#141413] font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#D97757] text-[#141413] shadow-[3px_3px_0px_#141413]'
                      : 'bg-[#FFFFFF] text-[#141413] hover:bg-[#F0EEE6]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Panel */}
        <main className="lg:col-span-9 min-w-0">
          {toast && (
            <div className="mb-6 px-4 py-3 bg-[#D97757] text-[#141413] border-2 border-[#141413] rounded-lg font-bold text-sm flex items-center gap-2 shadow-[4px_4px_0px_#141413]">
              <Check className="w-4 h-4 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {activeTab === 'courses' && (
            <AdminCoursesPanel
              courses={state.courses}
              sections={state.sections}
              driveConfig={state.driveConfig}
              onUpdateCourses={handleUpdateCourses}
              onUpdateSections={handleUpdateSections}
              onNotify={notify}
            />
          )}

          {activeTab === 'sections' && (
            <AdminSectionsPanel
              profile={state.profile}
              sections={state.sections}
              onUpdateProfile={handleUpdateProfile}
              onUpdateSections={handleUpdateSections}
              onNotify={notify}
            />
          )}

          {(activeTab === 'masterclasses' ||
            activeTab === 'testimonials' ||
            activeTab === 'lab' ||
            activeTab === 'settings') && (
            <AdminExtrasPanel
              mode={activeTab}
              state={state}
              courses={state.courses}
              onUpdateState={onUpdateState}
              onUpdateSections={handleUpdateSections}
              onResetDefaults={onResetDefaults}
              onNotify={notify}
            />
          )}
        </main>
      </div>
    </div>
  );
};
