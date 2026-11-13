# ZeroToFab Security & Deployment Hardening Guide

## 1. Pre-Locking `/admin` on Deployed Builds (`VITE_ADMIN_PASSWORD_HASH`)

By default, opening `/admin` for the first time prompts you to set an admin password in your browser. To ship every build pre-locked with your password hash:

1. Generate a salted PBKDF2-SHA256 hash locally (the plaintext password never leaves your machine):
   ```bash
   npm run hash-password
   ```
2. In your GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**.
3. Create a secret named `VITE_ADMIN_PASSWORD_HASH` and paste the generated `pbkdf2-sha256$150000$...` string.
4. Re-run the `Deploy to GitHub Pages` workflow (`.github/workflows/deploy.yml`).

> **Important (Static SPA Architecture):** Because this app runs purely in the browser on GitHub Pages without a backend database, client-side password checks protect the UI and local browser storage from casual visitors, not from someone inspecting browser DevTools or hosting files. If you later connect a shared backend API/database, enforce authentication on the server or at the CDN edge.

---

## 2. Adding Edge Protection with Cloudflare Access (Recommended for Custom Domains)

If you proxy your domain through **Cloudflare**:

1. In Cloudflare Zero Trust, go to **Access → Applications → Add an application → Self-hosted**.
2. Protect path `/admin` (and `/admin/*`) with an Identity Provider policy (Google / GitHub / Email OTP) restricted to your admin email.
3. This enforces authentication **before** `/admin` is even served.

---

## 3. Production Security Headers

- Production builds automatically inject a `<meta http-equiv="Content-Security-Policy">` tag into `dist/index.html` via `vite.config.ts`.
- `public/_headers` is included for platforms that support `_headers` (Cloudflare Pages, Netlify).
- On GitHub Pages behind Cloudflare, configure a **Response Header Transform Rule** to send:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

---

## 4. Google Drive Video Privacy

- When uploading videos directly from `/admin` to Google Drive, uncheck **"Make uploaded video link public"** if you use a private `proxyBaseUrl` stream endpoint so paid videos are not shared as `"Anyone with the link can view"`.
