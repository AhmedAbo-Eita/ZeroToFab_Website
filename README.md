# ZeroToFab — PCB Design Masterclass Website

An interactive web platform and course showcase for **ZeroToFab**, a beginner-to-advanced PCB engineering masterclass covering schematic capture, multi-layer stackups, high-speed routing, power integrity, and real-world DFM/bring-up.

## Features

- **Course Showcase & Landing Page**:
  - Announcement marquee, promotional hero banner, and instructor hero with animated stats.
  - Ecosystem trust strip, core engineering pillars, hardware case studies, and masterclasses.
  - Interactive curriculum browser with level filtering, live countdown timer, and an embedded **Course Player Modal** supporting lesson notes, downloadable attachments, and `localStorage`-persisted lesson completion tracking.
  - Testimonials marquee, Content Lab video showcase, and instructor bio section.
- **Built-in Admin Dashboard (`/admin` or `#/admin`)**:
  - Manage course modules, lessons, attachments, and media sources (demo, YouTube, MP4, Google Drive with optional public/private visibility toggle, or local uploads via IndexedDB).
  - Customize branding (brand name, hero copy, dynamic page title and raster favicon), toggle page sections, edit masterclasses, testimonials, and lab videos.
  - PBKDF2-SHA256 password protection (with first-time setup or `VITE_ADMIN_PASSWORD_HASH` pre-lock, 5-attempt exponential lockout, and 30-minute idle auto-lock), URL/media sanitization, and JSON backup/reset persisted in `localStorage`.

See [SECURITY.md](./SECURITY.md) for deployment hardening, edge protection, and Content Security Policy details.

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

### Build, Preview & Admin Password Hash

```bash
# Generate a salted PBKDF2-SHA256 hash for GitHub Secret VITE_ADMIN_PASSWORD_HASH
npm run hash-password

# Type-check and build for production (injects production CSP meta tag)
npm run build

# Preview the production build locally
npm run preview
```

## Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys the site automatically on every push to `main`.

1. In your GitHub repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or trigger the **Deploy to GitHub Pages** workflow manually under **Actions**).

Once deployed, the site will be live at `https://ahmedabo-eita.github.io/ZeroToFab_Website/` (and the admin dashboard at `/#/admin`).

## Project Structure

```text
├── public/
│   ├── _headers                 # Security headers for Cloudflare Pages / Netlify
│   └── favicon.svg
├── scripts/
│   └── hash-admin-password.mjs  # CLI generator for VITE_ADMIN_PASSWORD_HASH
├── src/
│   ├── components/
│   │   ├── admin/               # Admin panels (courses, sections, extras)
│   │   ├── AdminDashboard.tsx   # Password-protected Admin CMS (/admin or #/admin)
│   │   ├── CoursePlayerModal.tsx
│   │   ├── CurriculumSection.tsx
│   │   └── ...                  # Landing page sections & UI components
│   ├── data/
│   │   └── defaultData.ts       # Default courses, profile, and site state
│   ├── types/
│   │   └── course.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── googleDrive.ts       # Google Drive media helpers
│   │   ├── mediaStorage.ts      # IndexedDB local media storage
│   │   └── security.ts          # PBKDF2 auth, lockout, session TTL, URL/image sanitizers
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── SECURITY.md                  # Security & deployment hardening guide
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```
