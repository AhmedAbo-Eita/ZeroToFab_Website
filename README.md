# ZeroToFab — PCB Design Masterclass Website

An interactive web platform and course showcase for **ZeroToFab**, a beginner-to-advanced PCB engineering masterclass covering schematic capture, multi-layer stackups, high-speed routing, power integrity, and real-world DFM/bring-up.

## Features

- **Course Showcase & Landing Page**:
  - Announcement marquee, promotional hero banner, and instructor hero with animated stats.
  - Ecosystem trust strip, core engineering pillars, hardware case studies, and masterclasses.
  - Interactive curriculum browser with level filtering, live countdown timer, and an embedded **Course Player Modal** supporting lesson notes, downloadable attachments, and `localStorage`-persisted lesson completion tracking.
  - Testimonials marquee, Content Lab video showcase, and instructor bio section.
- **Built-in Admin Dashboard (`/admin` or `#/admin`)**:
  - Manage course modules, lessons, attachments, and media sources (demo, YouTube, MP4, Google Drive, or local uploads via IndexedDB).
  - Customize branding (brand name, hero copy, dynamic page title and favicon), toggle page sections, edit masterclasses, testimonials, and lab videos.
  - Optional passcode lock and reset-to-defaults support, persisted in `localStorage`.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Build & Preview

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```text
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/               # Admin panels (courses, sections, extras)
│   │   ├── AdminDashboard.tsx   # Admin route (/admin or #/admin)
│   │   ├── CoursePlayerModal.tsx
│   │   ├── CurriculumSection.tsx
│   │   └── ...                  # Landing page sections & UI components
│   ├── data/
│   │   └── defaultData.ts       # Default courses, profile, and site state
│   ├── types/
│   │   └── course.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── googleDrive.ts       # Google Drive media helpers
│   │   └── mediaStorage.ts      # IndexedDB local media storage
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```
