import {
  CourseModule,
  FullSiteState,
  InstructorProfile,
  LabVideoItem,
  MasterclassItem,
  SiteSectionsConfig,
  StudentUser,
  TestimonialItem,
} from '../types/course';

export const DEFAULT_INSTRUCTOR: InstructorProfile = {
  name: 'ZeroToFab',
  brandName: 'ZeroToFab',
  headline: 'Welcome to ZeroToFab.',
  subheadline:
    'A complete PCB engineering masterclass taking you from breadboard prototypes to production-ready, impedance-controlled multi-layer circuit boards.',
  primaryCtaText: 'Explore Masterclass',
  bio: 'Built on over a decade of designing and shipping 60+ commercial PCBs—from low-power BLE wearables and 65W GaN USB-PD chargers to 8-layer DDR4 SOMs. ZeroToFab breaks down schematic architecture, high-speed signal integrity, and real-world DFM/assembly rules into practical, project-based lessons you can apply immediately.',
  stickerText: 'MAKE HARDWARE SIMPLE',
  promoBannerText:
    'Cohort 04 Enrollment Open — Up to 40% Off   ⚡   Beginner to Advanced High-Speed PCB Masterclass   ◈   On-Demand HD Video Lessons & Gerbers   ⚡   30-Day Money-Back Guarantee',
  showTopMarquee: true,
  heroTitle: 'PCB Design Masterclass',
  heroBadge: 'BEGINNER → ADVANCED TRACK',
  heroStarburstText: 'ZERO TO PRO',
  heroOfferBoxText: '40% OFF COHORT',
  heroSubtitle:
    'Master schematic capture, 4-to-8 layer stackups, high-speed routing, power integrity, and real factory bring-up.',
  heroCtaText: 'Explore curriculum',
  heroGuaranteeText: 'Self-paced video lessons · Gerber & schematic files included',
  showHeroPromo: true,
  stats: {
    rating: '4.9',
    students: 2450,
    boardsShipped: 64,
    yearsExp: 10,
  },
};

export const DEFAULT_COURSES: CourseModule[] = [
  {
    id: 'mod-01-fundamentals',
    number: '01',
    title: 'PCB Fundamentals & Clean Schematic Capture',
    subtitle:
      'Start from zero: learn schematic symbols, custom footprints, ERC/DRC checks, and take your first 2-layer USB-C board to fabrication.',
    level: 'Beginner',
    category: 'Foundations',
    rating: 4.9,
    ratingCount: 318,
    price: 0,
    totalHours: '4.5 hrs',
    thumbnailTheme: 'schematic',
    tags: ['KiCad 8 / Altium', 'ERC & Footprints', '2-Layer'],
    lessons: [
      {
        id: 'les-01-1',
        title: 'How PCBs Are Actually Built (FR-4, Copper Weight & Soldermask)',
        duration: '18:40',
        summary:
          'Understand prepreg, core thickness, 1oz vs 2oz copper, surface finishes (HASL vs ENIG), and how fab houses interpret your files.',
        notes: `### Key Engineering Takeaways
- **Standard 2-Layer Stackup**: 1.6mm FR-4 core with 1oz (35 µm) outer copper layers.
- **HASL vs ENIG**: Use Lead-Free HASL for simple through-hole/0805 boards; switch to **ENIG (Gold)** for fine-pitch QFNs, BGAs, and edge connectors.
- **Annular Ring Rule**: Always maintain at least **0.125 mm** annular ring around drilled vias to prevent breakout during fabrication.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [
          {
            id: 'att-1',
            name: 'Fab_Capabilities_Cheatsheet_2026.pdf',
            type: 'pdf',
            sizeLabel: '1.4 MB',
          },
        ],
      },
      {
        id: 'les-01-2',
        title: 'Designing Readable Hierarchical Schematics & Custom Symbols',
        duration: '26:15',
        summary:
          'Stop drawing spaghetti schematics. Learn net labels, power flags, decoupling conventions, and IPC-7351 footprint creation.',
        notes: `### Schematic Checklist
1. Separate Power, MCU, Interfaces, and Analog into hierarchical sheets.
2. Add **pin type definitions** (Input, Output, Power In, Bidirectional) so ERC catches shorts automatically.
3. Place datasheet pinout screenshot and voltage rail notes directly on the schematic page.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [
          {
            id: 'att-2',
            name: 'IPC7351_Footprint_Template.kicad_mod',
            type: 'schematic',
            sizeLabel: '42 KB',
          },
        ],
      },
      {
        id: 'les-01-3',
        title: 'First 2-Layer Layout: Component Placement, Pouring & Gerber Export',
        duration: '34:20',
        summary:
          'Place parts with thermal and signal flow in mind, route power traces cleanly, pour solid ground, and inspect Gerbers before ordering.',
        notes: `### Layout Golden Rules for Beginners
- Route **90% of signals on Top**, keep **Bottom as an uninterrupted GND reference plane**.
- Never route 90-degree acute corners on etched traces; use 45° miters or smooth arcs.
- Always open exported Gerbers in a standalone viewer before hitting checkout.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        attachments: [
          {
            id: 'att-3',
            name: 'Starter_USB_LED_Board_Gerbers.zip',
            type: 'gerber',
            sizeLabel: '860 KB',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-02-4layer-mcu',
    number: '02',
    title: '4-Layer Mixed-Signal STM32 + USB-C Layout',
    subtitle:
      'Transition from 2-layer hobby boards to reliable 4-layer industrial hardware with uninterrupted return paths, crystal guard rings, and ESD protection.',
    level: 'Beginner',
    category: '4-Layer Layout',
    rating: 4.8,
    ratingCount: 214,
    price: 89,
    originalPrice: 149,
    discountPercent: 40,
    totalHours: '6.5 hrs',
    thumbnailTheme: '4layer',
    tags: ['STM32H7', 'USB-C 90Ω', '4-Layer Stackup'],
    lessons: [
      {
        id: 'les-02-1',
        title: 'Choosing the Right 4-Layer Stackup (SIG / GND / PWR / SIG)',
        duration: '22:10',
        summary:
          'Why SIG-GND-GND-SIG beats SIG-GND-PWR-SIG for EMI and impedance stability, and how return currents actually flow.',
        notes: `### Recommended 4-Layer Stackup
- **L1 (Top):** Components + Primary Signal Routing + Short Power Shapes
- **L2 (Inner 1):** Solid Unbroken GND Plane (0.1mm–0.2mm below L1!)
- **L3 (Inner 2):** Solid GND + Localized Power Polygons
- **L4 (Bottom):** Low-Speed Signals & Test Points`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [
          {
            id: 'att-4',
            name: '4Layer_Impedance_Stackup_Spec.pdf',
            type: 'pdf',
            sizeLabel: '920 KB',
          },
        ],
      },
      {
        id: 'les-02-2',
        title: 'Decoupling Capacitor Placement & Crystal Oscillator Layout',
        duration: '28:50',
        summary:
          'Minimize via inductance for 100nF ceramic caps and isolate HSE 25MHz crystals with solid ground guard vias.',
        notes: `### Decoupling & Crystal Rules
- Connect capacitor pad **before** the MCU VDD pin—never branch off a long stub.
- Keep crystal traces short (< 8mm), symmetric, and free of neighboring switching clocks.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        attachments: [],
      },
    ],
  },
  {
    id: 'mod-03-power-electronics',
    number: '03',
    title: 'Power Electronics, Buck Converters & GaN SMPS',
    subtitle:
      'Design quiet, cool-running switching supplies. Minimize hot-loop area, place thermal vias, calculate trace ampacity, and meet creepage/clearance.',
    level: 'Intermediate',
    category: 'Power Integrity',
    rating: 4.9,
    ratingCount: 176,
    price: 119,
    originalPrice: 199,
    discountPercent: 40,
    totalHours: '8.0 hrs',
    thumbnailTheme: 'power',
    tags: ['Buck/Boost', 'USB-PD 65W', 'Thermal Vias'],
    lessons: [
      {
        id: 'les-03-1',
        title: 'Minimizing the High di/dt Switching Hot Loop in Buck Converters',
        duration: '31:05',
        summary:
          'Identify discontinuous current paths on the schematic and shrink the physical loop area on L1 to slash radiated EMI by 20 dB.',
        notes: `### Switching Regulator Hot-Loop Checklist
- Place **CIN (input ceramic cap)** immediately next to VIN and PGND pins on the same layer.
- Keep the **SW node polygon** compact—large SW copper acts like a capacitive antenna!
- Route feedback (FB) divider traces far away from the inductor and SW node.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [
          {
            id: 'att-5',
            name: '65W_GaN_Buck_Reference_Layout.pdf',
            type: 'schematic',
            sizeLabel: '2.1 MB',
          },
        ],
      },
      {
        id: 'les-03-2',
        title: '2oz Copper Pours, Thermal Via Arrays & Kelvin Current Sensing',
        duration: '24:45',
        summary:
          'Use IPC-2152 current charts, stitched thermal via grids under QFN exposed pads, and true 4-wire Kelvin sense routing.',
        notes: `### Thermal & Sense Notes
- Use **0.3mm drill / 0.6mm pad** thermal vias pitched at 1.0mm–1.2mm under power MOSFETs.
- Tent or plug thermal vias on the bottom if reflowing QFN pads to prevent solder wicking.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        attachments: [],
      },
    ],
  },
  {
    id: 'mod-04-highspeed-ddr',
    number: '04',
    title: 'High-Speed Digital: DDR4, PCIe & Differential Pairs',
    subtitle:
      'Engineer 6-to-10 layer stackups with 50Ω single-ended and 85Ω/90Ω/100Ω differential pairs, via backdrilling, and intra-pair skew tuning.',
    level: 'Advanced',
    category: 'Signal Integrity',
    rating: 5.0,
    ratingCount: 142,
    price: 149,
    originalPrice: 249,
    discountPercent: 40,
    totalHours: '10.5 hrs',
    thumbnailTheme: 'highspeed',
    tags: ['DDR4 Fly-By', '50Ω / 100Ω', 'Length Tuning'],
    lessons: [
      {
        id: 'les-04-1',
        title: 'Controlled Impedance, Dielectric Loss (Dk/Df) & Return Vias',
        duration: '37:15',
        summary:
          'Calculate microstrip and stripline geometries, avoid fiberglass weave skew, and pair every layer-transition via with return GND vias.',
        notes: `### High-Speed Routing Essentials
- Target **±10% (or ±5% for DDR/PCIe)** impedance tolerance in fab notes.
- Whenever a differential pair changes reference plane (e.g., L1 → L6), place **two symmetric GND stitching vias** within 0.8mm of the signal vias.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [
          {
            id: 'att-6',
            name: '8Layer_DDR4_Stackup_Calculator.xlsx',
            type: 'bom',
            sizeLabel: '540 KB',
          },
        ],
      },
      {
        id: 'les-04-2',
        title: 'DDR4 Fly-By Topology, Serpentine Meanders & Skew Budgets',
        duration: '42:30',
        summary:
          'Route Address/Command/Control in fly-by with VTT termination and match DQ/DQS byte lanes within ±5ps.',
        notes: `### Skew Matching Rules
- Match **Intra-pair skew** (D+ vs D-) as close to the pin mismatch source as possible.
- Keep trombone meander spacing ≥ **3× trace width (3W)** to prevent self-coupling crosstalk.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        attachments: [],
      },
    ],
  },
  {
    id: 'mod-05-rf-emc',
    number: '05',
    title: 'RF Layout, BLE Antennas & EMC Compliance Testing',
    subtitle:
      'Route 50Ω coplanar waveguides with ground (CPWG), tune Pi matching networks, and pass FCC/CE radiated emissions on your first spin.',
    level: 'Advanced',
    category: 'RF & EMC',
    rating: 4.9,
    ratingCount: 98,
    price: 139,
    originalPrice: 229,
    discountPercent: 39,
    totalHours: '7.5 hrs',
    thumbnailTheme: 'rf',
    tags: ['2.4GHz BLE', 'CPWG 50Ω', 'Pre-Compliance'],
    lessons: [
      {
        id: 'les-05-1',
        title: '50Ω CPWG Transmission Lines & Chip/PCB Antenna Keepouts',
        duration: '29:50',
        summary:
          'Design coplanar waveguides with dense via fencing, remove inner-layer copper beneath PCB trace antennas, and size the Pi matching network.',
        notes: `### RF Layout Must-Haves
- Clear **ALL copper planes** on every layer directly underneath the antenna keepout zone.
- Place Pi-network components (0402) inline without stubbing pads wider than the 50Ω trace.`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [],
      },
    ],
  },
  {
    id: 'mod-06-dfm-bringup',
    number: '06',
    title: 'DFM, Panelization, Assembly & Lab Bring-Up',
    subtitle:
      'Prepare bulletproof Gerber X2 / ODB++ packages, BOM & Pick-and-Place files, fiducials, V-score panels, and systematic oscilloscope bring-up.',
    level: 'Intermediate',
    category: 'Manufacturing',
    rating: 4.8,
    ratingCount: 164,
    price: 79,
    originalPrice: 129,
    discountPercent: 39,
    totalHours: '5.5 hrs',
    thumbnailTheme: 'dfm',
    tags: ['ODB++ / Gerber X2', 'Pick & Place', 'Bring-Up'],
    lessons: [
      {
        id: 'les-06-1',
        title: 'Bulletproof Production Outputs: BOM, CPL, Fiducials & Panels',
        duration: '25:10',
        summary:
          'Avoid costly assembly delays: configure 1mm global fiducials, verify Pin-1 orientation in pick-and-place files, and panelize with mouse bites.',
        notes: `### Production Release Checklist
1. 3 asymmetrical **1.0mm fiducials** (with 2.0mm soldermask opening) on each panel rail.
2. Verify diode cathodes & IC Pin-1 rotations against the CM assembly previewer.
3. Run current-limited bench power supply (100mA limit) on initial power-up!`,
        videoType: 'demo',
        driveRequestOnDemand: true,
        isFreePreview: true,
        attachments: [
          {
            id: 'att-7',
            name: 'Production_Release_DFM_Checklist.pdf',
            type: 'pdf',
            sizeLabel: '780 KB',
          },
        ],
      },
    ],
  },
];

export const DEFAULT_MASTERCLASSES: MasterclassItem[] = [
  {
    id: 'mc-zero-to-fab',
    title: 'Zero to Manufactured 4-Layer Board in One Weekend',
    badge: 'LIVE INTENSIVE · 4 HOURS',
    description:
      'Watch a complete ESP32-S3 + USB-C + LiPo charger board go from blank schematic to verified Gerber X2 & JLCPCB SMT order in real time.',
    bullets: [
      'Complete KiCad 8 / Altium project & component library included',
      'Live impedance & 4-layer return path walkthrough',
      'Full BOM optimization for under $6/board at quantity 10',
    ],
    price: 49,
    duration: '4h 15m',
    linkedModuleId: 'mod-02-4layer-mcu',
  },
  {
    id: 'mc-si-emc',
    title: 'High-Speed Signal Integrity & EMC Debug Lab',
    badge: 'PRO DEEP DIVE · 5 HOURS',
    description:
      'Diagnose ringing, ground bounce, crosstalk, and failed FCC radiated emissions using near-field probes and real 8-layer DDR4 case studies.',
    bullets: [
      '8-layer stackup design & S-parameter / TDR intuition without PhD math',
      'Near-field sniffing demo on live switching & MCU boards',
      '12-point pre-compliance EMC checklist before lab booking',
    ],
    price: 69,
    duration: '5h 05m',
    linkedModuleId: 'mod-04-highspeed-ddr',
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Tariq Al-Mansoor',
    role: 'Embedded Hardware Engineer',
    quote:
      'I went from failing EMC on a 2-layer motor controller to passing CE on the first 4-layer spin. The hot-loop and return-via lessons alone saved us $4,000.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Elena Rostova',
    role: 'Robotics Systems Lead',
    quote:
      'Every PCB course online stops at blinking an LED. This masterclass actually teaches DDR4 fly-by routing, controlled impedance, and real factory bring-up.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Omar Hassan',
    role: 'Firmware & IoT Founder',
    quote:
      'Our BLE wearable range doubled after applying the CPWG 50-ohm trace and antenna keepout module. Crystal clear explanations.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Marcus Chen',
    role: 'Power Electronics Engineer',
    quote:
      'The 65W GaN buck converter layout breakdown is gold. Showing exact polygon pours and Kelvin sense routing made everything click.',
    rating: 5,
  },
  {
    id: 't5',
    name: 'Sarah Jenkins',
    role: 'Junior EE → Senior Layout Designer',
    quote:
      'Built two portfolio boards using the exact DFM checklists here and landed a hardware design role at an EV startup within 6 weeks.',
    rating: 5,
  },
  {
    id: 't6',
    name: 'Youssef Karim',
    role: 'Mechatronics Engineer',
    quote:
      'Finally someone explains why SIG-GND-GND-SIG works better than splitting ground planes! Zero fluff, pure engineering.',
    rating: 5,
  },
];

export const DEFAULT_LAB_VIDEOS: LabVideoItem[] = [
  {
    id: 'lab-1',
    index: '01',
    category: 'LAYOUT WALKTHROUGH',
    title: 'Routing a 90Ω USB-C & STM32H7 Board From Scratch',
    description:
      'Step-by-step live layout showing fanout strategies, length matching, and solid ground stitching under BGA/QFN packages.',
    duration: '42:18',
    linkedModuleId: 'mod-02-4layer-mcu',
  },
  {
    id: 'lab-2',
    index: '02',
    category: 'LAB BRING-UP',
    title: 'First Power-On: Current Limiting, Thermal Cam & Scope Probing',
    description:
      'How to power up a brand new PCB without letting out magic smoke, measure ripple properly with a ground spring, and debug dead rails.',
    duration: '28:54',
    linkedModuleId: 'mod-06-dfm-bringup',
  },
  {
    id: 'lab-3',
    index: '03',
    category: 'DFM & FAB',
    title: 'Inside PCB Fabrication: Drilling, Plating & Impedance Coupons',
    description:
      'What actually happens to your Gerbers on the factory floor—acid traps, solder mask slivers, and why DFM rules exist.',
    duration: '35:10',
    linkedModuleId: 'mod-01-fundamentals',
  },
];

export const DEFAULT_SECTIONS: SiteSectionsConfig = {
  showTrustStrip: true,
  trustEyebrow: 'ECAD TOOLS & FAB ECOSYSTEM',
  trustHeading: 'Industry workflows, real fabs, and production silicon.',
  ecosystem: [
    { id: 'eco-1', name: 'Altium Designer', sub: 'Enterprise ECAD' },
    { id: 'eco-2', name: 'KiCad 8', sub: 'Open-Source EDA' },
    { id: 'eco-3', name: 'JLCPCB', sub: 'SMT & 4-8L Fab' },
    { id: 'eco-4', name: 'PCBWay', sub: 'Rigid-Flex & HDI' },
    { id: 'eco-5', name: 'STMicro', sub: 'STM32 Mixed-Signal' },
    { id: 'eco-6', name: 'Texas Instruments', sub: 'Power & GaN Buck' },
    { id: 'eco-7', name: 'Nordic Semi', sub: '2.4GHz BLE & RF' },
    { id: 'eco-8', name: 'Analog Devices', sub: 'Precision & SI' },
  ],

  showPillars: true,
  pillarsEyebrow: "WHAT YOU'LL MASTER",
  pillarsHeading: 'Learn schematic capture, multi-layer layout, and real hardware bring-up.',
  pillars: [
    {
      id: 'pil-1',
      num: '01',
      title: 'Schematic & Architecture',
      desc: 'Build clean multi-sheet schematics, IPC-7351 custom footprints, power trees, and error-free BOMs before placing a single trace.',
      icon: 'cpu',
    },
    {
      id: 'pil-2',
      num: '02',
      title: 'High-Speed & Power Layout',
      desc: 'Master 4-to-8 layer stackups, controlled impedance (50Ω/90Ω/100Ω), uninterrupted return paths, and quiet switching power loops.',
      icon: 'layers',
    },
    {
      id: 'pil-3',
      num: '03',
      title: 'DFM, Fab & Lab Bring-Up',
      desc: 'Export bulletproof Gerber X2 / ODB++ packages, panelize for assembly, and bring up your first board safely with an oscilloscope.',
      icon: 'wrench',
    },
  ],

  showCaseStudies: true,
  caseStudiesEyebrow: 'REAL ENGINEERING CASE STUDIES',
  caseStudiesHeading: 'Inside the actual boards you will design, simulate, and debug.',
  caseStudies: [
    {
      id: 'cs-1',
      badge: 'CASE STUDY 01',
      tag: 'STACKUP & SIGNAL INTEGRITY',
      title: '2-Layer to 6-Layer Controlled Impedance Migration for STM32 + DDR4',
      description:
        'How moving from a noisy 2-layer prototype to a symmetric 6-layer stackup eliminated clock ringing and stabilized 90Ω USB-C & 100Ω differential pairs.',
      ctaText: 'Inspect module lessons',
      linkedModuleId: 'mod-04-highspeed-ddr',
      variant: 'stackup',
    },
    {
      id: 'cs-2',
      badge: 'CASE STUDY 02',
      tag: 'POWER & EMI COMPLIANCE',
      title: 'Cutting 22 dB Radiated Emissions in a 65W USB-PD GaN Buck Converter',
      description:
        'Shrinking the input capacitor hot-loop from 420 mm² down to 38 mm² and stitching a solid L2 ground plane turned an EMC failure into a first-pass CISPR-32 certification.',
      ctaText: 'Inspect power integrity module',
      linkedModuleId: 'mod-03-power-electronics',
      variant: 'gan',
    },
  ],
  callout: {
    badge: 'DESIGN REVIEWS INCLUDED',
    headline: 'Don’t ship a $2,000 prototype spin with a hidden layout bug.',
    description:
      'Every advanced module includes downloadable DFM checklists, stackup templates, and structured schematic/layout review criteria used in commercial hardware teams.',
    bullets: [
      'Gerber X2 Verification',
      'Impedance Stackup Specs',
      'Bring-Up Checklists',
    ],
    ctaText: 'Preview DFM & Bring-Up Module',
    linkedModuleId: 'mod-06-dfm-bringup',
    polaroidTitle: 'Rev C Production Bring-Up',
    polaroidStatus: 'PASS',
    polaroidScopeLabel: 'CH1: 3V3_RAIL',
    polaroidScopeMetric: 'RIPPLE: 11mVpp',
    polaroidScopeFooter: 'CLEAN SQUARE WAVE · ZERO RINGING',
  },

  showCurriculum: true,
  curriculumEyebrow: 'CURRICULUM · BEGINNER TO ADVANCED',
  curriculumHeading: 'Structured modules from first schematic to high-speed fab.',
  showCountdown: true,
  countdownLabel: 'Cohort Offer Ends In:',
  countdownEndIso: new Date(Date.now() + 42 * 3600 * 1000).toISOString(),

  showMasterclasses: true,
  masterclassesEyebrow: 'MASTERCLASSES',
  masterclassesHeading: 'Master one critical PCB discipline in one focused intensive.',

  showTestimonials: true,
  testimonialsHeading: 'What Hardware Engineers Say',
  testimonialsSubheading:
    'Hover any card to pause · Real outcomes from prototypes to mass production.',

  showLabVideos: true,
  labEyebrow: 'CONTENT & HARDWARE LAB',
  labHeading: 'Free hardware teardowns & lab walkthroughs.',
  labBottomCtaText: 'EXPLORE ALL LAB LESSONS & FREE PREVIEWS',

  showBio: true,
  bioHeadingPrefix: 'Why',
  skillPills: [
    { id: 'sp-1', label: 'Altium Designer', variant: 'dark' },
    { id: 'sp-2', label: 'KiCad 8', variant: 'orange' },
    { id: 'sp-3', label: '8-Layer DDR4', variant: 'amber' },
    { id: 'sp-4', label: '65W GaN SMPS', variant: 'terracotta' },
    { id: 'sp-5', label: 'USB-C PD 3.1', variant: 'sand' },
    { id: 'sp-6', label: 'EMC Pre-Compliance', variant: 'dark-orange' },
  ],

  footerSlogan:
    'Practical PCB design & hardware engineering masterclasses from first schematic to multi-layer production bring-up.',
  footerYoutubeUrl: 'https://youtube.com',
  footerLinkedinUrl: 'https://linkedin.com',
  footerGithubUrl: 'https://github.com',
  footerCopyright: 'Built for PCB Engineers.',
  footerTagline: '50Ω / 90Ω / 100Ω · ZERO TO PRODUCTION',
};

export const DEFAULT_USERS: StudentUser[] = [
  {
    id: 'user-demo-student',
    email: 'engineer@example.com',
    name: 'Demo Hardware Student',
    unlockedCourseIds: ['mod-02-4layer-mcu'],
    unlockAllCourses: false,
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z',
    notes:
      'Sample pre-authorized student with Module 02 unlocked (claim via Create Account or set password in Admin).',
  },
];

export const DEFAULT_SITE_STATE: FullSiteState = {
  profile: DEFAULT_INSTRUCTOR,
  sections: DEFAULT_SECTIONS,
  courses: DEFAULT_COURSES,
  masterclasses: DEFAULT_MASTERCLASSES,
  testimonials: DEFAULT_TESTIMONIALS,
  labVideos: DEFAULT_LAB_VIDEOS,
  driveConfig: {
    clientId: '',
    folderId: '',
    proxyBaseUrl: '',
    defaultOnDemand: true,
  },
  security: {
    passcodeEnabled: true,
    passcodeHash: '',
  },
  users: DEFAULT_USERS,
};
