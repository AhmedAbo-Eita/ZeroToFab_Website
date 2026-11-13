export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ResourceAttachment {
  id: string;
  name: string;
  type: 'gerber' | 'schematic' | 'pdf' | 'bom' | 'other';
  sizeLabel: string;
  url?: string;
  mediaKey?: string; // IndexedDB key for uploaded local files
  driveFileId?: string; // Optional Google Drive attachment ID
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  notes: string;
  videoType: 'gdrive' | 'youtube' | 'mp4' | 'uploaded' | 'demo';
  videoUrl?: string;
  videoMediaKey?: string; // IndexedDB key for uploaded video
  driveFileId?: string; // Google Drive File ID
  driveRequestOnDemand?: boolean; // Load only when user explicitly clicks request/play
  attachments: ResourceAttachment[];
  isFreePreview?: boolean;
}

export interface CourseModule {
  id: string;
  number: string; // e.g., "01"
  title: string;
  subtitle: string;
  level: CourseLevel;
  category: string;
  rating: number;
  ratingCount: number;
  price: number; // 0 for free
  originalPrice?: number;
  discountPercent?: number;
  totalHours: string;
  thumbnailTheme: 'schematic' | '4layer' | 'power' | 'highspeed' | 'rf' | 'dfm';
  tags: string[];
  lessons: Lesson[];
}

export interface MasterclassItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  bullets: string[];
  price: number;
  duration: string;
  linkedModuleId: string;
}

export interface InstructorProfile {
  name: string;
  brandName: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  bio: string;
  stickerText: string;
  promoBannerText: string;
  showTopMarquee: boolean;
  heroTitle: string;
  heroBadge: string;
  heroStarburstText: string;
  heroOfferBoxText: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroGuaranteeText: string;
  showHeroPromo: boolean;
  photoDataUrl?: string;
  siteIconDataUrl?: string;
  stats: {
    rating: string;
    students: number;
    boardsShipped: number;
    yearsExp: number;
  };
}

export interface EcosystemItem {
  id: string;
  name: string;
  sub: string;
}

export interface PillarItem {
  id: string;
  num: string;
  title: string;
  desc: string;
  icon: 'cpu' | 'layers' | 'wrench';
}

export interface CaseStudyItem {
  id: string;
  badge: string;
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  linkedModuleId: string;
  variant: 'stackup' | 'gan';
}

export interface CalloutConfig {
  badge: string;
  headline: string;
  description: string;
  bullets: string[];
  ctaText: string;
  linkedModuleId: string;
  polaroidTitle: string;
  polaroidStatus: string;
  polaroidScopeLabel: string;
  polaroidScopeMetric: string;
  polaroidScopeFooter: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface LabVideoItem {
  id: string;
  index: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  driveFileId?: string;
  linkedModuleId?: string;
}

export interface SkillPill {
  id: string;
  label: string;
  variant: 'dark' | 'orange' | 'amber' | 'terracotta' | 'sand' | 'dark-orange';
}

export interface SiteSectionsConfig {
  showTrustStrip: boolean;
  trustEyebrow: string;
  trustHeading: string;
  ecosystem: EcosystemItem[];

  showPillars: boolean;
  pillarsEyebrow: string;
  pillarsHeading: string;
  pillars: PillarItem[];

  showCaseStudies: boolean;
  caseStudiesEyebrow: string;
  caseStudiesHeading: string;
  caseStudies: CaseStudyItem[];
  callout: CalloutConfig;

  showCurriculum: boolean;
  curriculumEyebrow: string;
  curriculumHeading: string;
  showCountdown: boolean;
  countdownLabel: string;
  countdownEndIso: string; // ISO timestamp for live countdown

  showMasterclasses: boolean;
  masterclassesEyebrow: string;
  masterclassesHeading: string;

  showTestimonials: boolean;
  testimonialsHeading: string;
  testimonialsSubheading: string;

  showLabVideos: boolean;
  labEyebrow: string;
  labHeading: string;
  labBottomCtaText: string;

  showBio: boolean;
  bioHeadingPrefix: string;
  skillPills: SkillPill[];

  footerSlogan: string;
  footerYoutubeUrl: string;
  footerLinkedinUrl: string;
  footerGithubUrl: string;
  footerCopyright: string;
  footerTagline: string;
}

export interface GoogleDriveConfig {
  clientId: string;
  folderId: string;
  proxyBaseUrl: string; // Optional custom backend endpoint if using private files
  defaultOnDemand: boolean;
}

export interface AdminSecurityConfig {
  passcodeEnabled: boolean;
  /** PBKDF2-SHA256 hash in the format pbkdf2-sha256$<iterations>$<saltB64>$<hashB64> */
  passcodeHash: string;
}

export interface FullSiteState {
  profile: InstructorProfile;
  sections: SiteSectionsConfig;
  courses: CourseModule[];
  masterclasses: MasterclassItem[];
  testimonials: TestimonialItem[];
  labVideos: LabVideoItem[];
  driveConfig: GoogleDriveConfig;
  security: AdminSecurityConfig;
}
