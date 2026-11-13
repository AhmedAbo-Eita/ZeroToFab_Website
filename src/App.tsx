import React, { useEffect, useState } from 'react';
import { DEFAULT_SITE_STATE } from './data/defaultData';
import { CourseModule, FullSiteState, LabVideoItem } from './types/course';
import { TopMarquee } from './components/TopMarquee';
import { Navbar } from './components/Navbar';
import { HeroPromoBanner } from './components/HeroPromoBanner';
import { InstructorHero } from './components/InstructorHero';
import { TrustStrip } from './components/TrustStrip';
import { PillarsSection } from './components/PillarsSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { CurriculumSection } from './components/CurriculumSection';
import { MasterclassesSection } from './components/MasterclassesSection';
import { TestimonialsMarquee } from './components/TestimonialsMarquee';
import { ContentLabSection } from './components/ContentLabSection';
import { InstructorBioSection } from './components/InstructorBioSection';
import { Footer } from './components/Footer';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { AdminDashboard } from './components/AdminDashboard';
import {
  getEnvAdminPasswordHash,
  hashAdminPassword,
  sanitizeImageSrc,
} from './utils/security';

const LS_STATE_KEY = 'zerotofab_site_state_v3';
const LS_COMPLETED_KEY = 'tracecraft_completed_v1';
const DEFAULT_FAVICON = `${import.meta.env.BASE_URL}favicon.svg?v=3`;

/** Matches `/admin` (under subpath deployments like GitHub Pages) or `#/admin` hash routes. */
function isAdminLocation(): boolean {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash;
  return (
    path === `${base}/admin` ||
    hash === '#/admin' ||
    hash.startsWith('#/admin/')
  );
}

/**
 * Loads persisted site state from `localStorage`, validates security metadata,
 * strips legacy plaintext passcodes, and schedules migration for custom legacy passwords.
 */
function loadInitialState(): {
  state: FullSiteState;
  legacyCustomPasscode?: string;
} {
  try {
    const raw = localStorage.getItem(LS_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FullSiteState> & {
        security?: {
          passcodeEnabled?: boolean;
          passcodeHash?: string;
          passcode?: string;
        };
      };
      const rawSec = parsed.security;
      const hasLegacyCustom =
        Boolean(rawSec?.passcodeEnabled) &&
        typeof rawSec?.passcode === 'string' &&
        rawSec.passcode.length > 0 &&
        rawSec.passcode !== 'admin123' &&
        !rawSec.passcodeHash;

      const sanitizedHash =
        typeof rawSec?.passcodeHash === 'string' &&
        rawSec.passcodeHash.startsWith('pbkdf2-sha256$')
          ? rawSec.passcodeHash
          : '';

      const passcodeEnabled =
        typeof rawSec?.passcodeEnabled === 'boolean'
          ? rawSec.passcodeEnabled || (!sanitizedHash && !getEnvAdminPasswordHash())
          : true;

      return {
        state: {
          ...DEFAULT_SITE_STATE,
          ...parsed,
          profile: { ...DEFAULT_SITE_STATE.profile, ...parsed.profile },
          sections: { ...DEFAULT_SITE_STATE.sections, ...parsed.sections },
          driveConfig: {
            ...DEFAULT_SITE_STATE.driveConfig,
            ...parsed.driveConfig,
          },
          security: {
            passcodeEnabled,
            passcodeHash: sanitizedHash,
          },
        },
        legacyCustomPasscode: hasLegacyCustom ? rawSec?.passcode : undefined,
      };
    }
  } catch {
    // fallback to defaults
  }
  return { state: DEFAULT_SITE_STATE };
}

export function App() {
  const [initial] = useState(loadInitialState);
  const [siteState, setSiteState] = useState<FullSiteState>(initial.state);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(isAdminLocation);

  // Migrate any legacy non-default plaintext passcode to PBKDF2 hash and scrub plaintext
  useEffect(() => {
    const legacy = initial.legacyCustomPasscode;
    if (!legacy) return;
    let cancelled = false;
    hashAdminPassword(legacy).then((hashed) => {
      if (cancelled) return;
      setSiteState((prev) => ({
        ...prev,
        security: {
          passcodeEnabled: true,
          passcodeHash: prev.security.passcodeHash || hashed,
        },
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [initial.legacyCustomPasscode]);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LS_COMPLETED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCourse, setActiveCourse] = useState<CourseModule | null>(null);

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(isAdminLocation());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_STATE_KEY, JSON.stringify(siteState));
    } catch {
      // ignore storage quota errors
    }
  }, [siteState]);

  // Sync browser tab title & dynamic favicon with Admin branding settings
  useEffect(() => {
    document.title = `${siteState.profile.brandName} — ${siteState.profile.heroTitle}`;
    const iconHref =
      sanitizeImageSrc(siteState.profile.siteIconDataUrl) || DEFAULT_FAVICON;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }, [siteState.profile.brandName, siteState.profile.heroTitle, siteState.profile.siteIconDataUrl]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_COMPLETED_KEY,
        JSON.stringify(completedLessonIds)
      );
    } catch {
      // ignore
    }
  }, [completedLessonIds]);

  const handleUpdateState = (patch: Partial<FullSiteState>) => {
    setSiteState((prev) => ({
      ...prev,
      ...patch,
      profile: patch.profile ? { ...prev.profile, ...patch.profile } : prev.profile,
      sections: patch.sections
        ? { ...prev.sections, ...patch.sections }
        : prev.sections,
      driveConfig: patch.driveConfig
        ? { ...prev.driveConfig, ...patch.driveConfig }
        : prev.driveConfig,
      security: patch.security
        ? { ...prev.security, ...patch.security }
        : prev.security,
    }));
  };

  const handleResetDefaults = () => {
    setSiteState(DEFAULT_SITE_STATE);
    localStorage.removeItem(LS_STATE_KEY);
  };

  const navigatePublic = () => {
    window.history.pushState({}, '', import.meta.env.BASE_URL);
    setIsAdminRoute(false);
  };

  if (isAdminRoute) {
    return (
      <AdminDashboard
        state={siteState}
        onUpdateState={handleUpdateState}
        onResetDefaults={handleResetDefaults}
        onGoToPublicSite={navigatePublic}
      />
    );
  }

  const { profile, sections, courses, masterclasses, testimonials, labVideos, driveConfig } =
    siteState;

  const scrollToCurriculum = () => {
    document
      .querySelector('#curriculum')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenModuleById = (moduleId?: string) => {
    const target = courses.find((c) => c.id === moduleId) || courses[0] || null;
    if (target) setActiveCourse(target);
  };

  const handleWatchLabVideo = (video: LabVideoItem) => {
    if (video.driveFileId) {
      // Open direct Google Drive on-demand player for this Lab Video
      setActiveCourse({
        id: video.id,
        number: video.index,
        title: video.title,
        subtitle: video.description,
        level: 'Intermediate',
        category: video.category,
        rating: 5.0,
        ratingCount: 1,
        price: 0,
        totalHours: video.duration,
        thumbnailTheme: '4layer',
        tags: [video.category],
        lessons: [
          {
            id: `${video.id}-lesson`,
            title: video.title,
            duration: video.duration,
            summary: video.description,
            notes: `### Hardware Lab Breakdown\n${video.description}`,
            videoType: 'gdrive',
            driveFileId: video.driveFileId,
            driveRequestOnDemand: driveConfig.defaultOnDemand,
            attachments: [],
          },
        ],
      });
      return;
    }
    handleOpenModuleById(video.linkedModuleId);
  };

  const handleToggleComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413]">
      {profile.showTopMarquee && <TopMarquee text={profile.promoBannerText} />}

      <Navbar
        brandName={profile.brandName}
        siteIconUrl={profile.siteIconDataUrl}
        onOpenFirstCourse={() => handleOpenModuleById(courses[0]?.id)}
      />

      <main>
        {profile.showHeroPromo && (
          <HeroPromoBanner
            profile={profile}
            onExploreClick={scrollToCurriculum}
          />
        )}

        <InstructorHero
          profile={profile}
          onExploreCurriculum={scrollToCurriculum}
        />

        {sections.showTrustStrip && (
          <TrustStrip
            eyebrow={sections.trustEyebrow}
            heading={sections.trustHeading}
            items={sections.ecosystem}
          />
        )}

        {sections.showPillars && (
          <PillarsSection
            eyebrow={sections.pillarsEyebrow}
            heading={sections.pillarsHeading}
            items={sections.pillars}
          />
        )}

        {sections.showCaseStudies && (
          <CaseStudiesSection
            eyebrow={sections.caseStudiesEyebrow}
            heading={sections.caseStudiesHeading}
            caseStudies={sections.caseStudies}
            callout={sections.callout}
            onOpenModule={handleOpenModuleById}
          />
        )}

        {sections.showCurriculum && (
          <CurriculumSection
            eyebrow={sections.curriculumEyebrow}
            heading={sections.curriculumHeading}
            showCountdown={sections.showCountdown}
            countdownLabel={sections.countdownLabel}
            countdownEndIso={sections.countdownEndIso}
            courses={courses}
            completedLessonIds={completedLessonIds}
            onSelectCourse={(course) => setActiveCourse(course)}
          />
        )}

        {sections.showMasterclasses && (
          <MasterclassesSection
            eyebrow={sections.masterclassesEyebrow}
            heading={sections.masterclassesHeading}
            items={masterclasses}
            onOpenModule={handleOpenModuleById}
          />
        )}

        {sections.showTestimonials && (
          <TestimonialsMarquee
            heading={sections.testimonialsHeading}
            subheading={sections.testimonialsSubheading}
            items={testimonials}
          />
        )}

        {sections.showLabVideos && (
          <ContentLabSection
            eyebrow={sections.labEyebrow}
            heading={sections.labHeading}
            bottomCtaText={sections.labBottomCtaText}
            videos={labVideos}
            onWatchVideo={handleWatchLabVideo}
            onExploreAll={() => handleOpenModuleById(courses[0]?.id)}
          />
        )}

        {sections.showBio && (
          <InstructorBioSection
            profile={profile}
            headingPrefix={sections.bioHeadingPrefix}
            skillPills={sections.skillPills}
          />
        )}
      </main>

      <Footer
        brandName={profile.brandName}
        siteIconUrl={profile.siteIconDataUrl}
        sections={sections}
        onOpenCurriculum={scrollToCurriculum}
      />

      <CoursePlayerModal
        course={activeCourse}
        driveConfig={driveConfig}
        completedLessonIds={completedLessonIds}
        onToggleComplete={handleToggleComplete}
        onClose={() => setActiveCourse(null)}
      />
    </div>
  );
}

export default App;
