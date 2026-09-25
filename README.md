# DesktopFlow ERP — Public Legal Website

Static public website for **DesktopFlow ERP** by **Awan Digital Solutions**.

Repository: [https://github.com/rehan120/desktopflow-legal](https://github.com/rehan120/desktopflow-legal)

This project is **independent** of the DesktopFlow ERP application. It provides the public HTTPS pages commonly required for Meta app review and publishing.

It contains **no** API keys, Meta App Secrets, WhatsApp access tokens, webhook tokens, passwords, or other secrets.

## What this project is

A lightweight, production-ready static website with:

- Product landing information for DesktopFlow ERP
- Privacy Policy
- Terms of Service
- Data Deletion Instructions

## Public pages

| Path | Purpose |
|------|---------|
| `/` | Product landing page |
| `/privacy-policy/` | Privacy Policy |
| `/terms/` | Terms of Service |
| `/data-deletion/` | Data Deletion Instructions |

Canonical Meta-style URLs (with or without trailing slash after deploy redirects):

- `https://<public-domain>/privacy-policy`
- `https://<public-domain>/terms`
- `https://<public-domain>/data-deletion`

## Tech stack

- Plain HTML + CSS
- No React, Vite, Electron, or backend
- No build step required
- Deployable as a static site on Cloudflare Pages, Netlify, GitHub Pages, or similar

## Run locally

From the project root:

```bash
npm start
```

Or:

```bash
npx --yes serve -l 4173
```

Then open:

- http://localhost:4173/
- http://localhost:4173/privacy-policy/
- http://localhost:4173/terms/
- http://localhost:4173/data-deletion/

Python alternative:

```bash
python -m http.server 4173
```

## Build

**No build step is required.**

This is a static site. Hosts should publish the repository root as-is.

Optional local validation:

```bash
npm run validate
```

## Deploy (free HTTPS)

### Option A — Cloudflare Pages (recommended)

1. Ensure this repository is available at [github.com/rehan120/desktopflow-legal](https://github.com/rehan120/desktopflow-legal).
2. Sign in at [https://dash.cloudflare.com/](https://dash.cloudflare.com/).
3. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
4. Select `rehan120/desktopflow-legal`.
5. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
6. Deploy.
7. Use the free `*.pages.dev` HTTPS URL, or attach a custom domain.

### Option B — Netlify

1. Sign in at [https://app.netlify.com/](https://app.netlify.com/).
2. **Add new site** → import `rehan120/desktopflow-legal` (or drag-and-drop deploy).
3. Publish directory: site root (`.` / `/`).
4. Build command: none required (`netlify.toml` is included).
5. Use the free `*.netlify.app` HTTPS URL, or add a custom domain.

### Option C — GitHub Pages

1. Repository **Settings** → **Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main` (or `master`), folder: `/ (root)`.
4. Save and wait for the HTTPS Pages URL.

## Meta Developer Console URLs

After deployment, replace `<public-domain>` with your live host:

- Privacy Policy: `https://<public-domain>/privacy-policy/`
- Terms of Service: `https://<public-domain>/terms/`
- Data Deletion: `https://<public-domain>/data-deletion/`
- Home (optional): `https://<public-domain>/`

## Project structure

```text
desktopflow-legal/
├── index.html
├── privacy-policy/index.html
├── terms/index.html
├── data-deletion/index.html
├── css/styles.css
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── netlify.toml
├── _redirects
├── package.json
├── scripts/validate.mjs
└── README.md
```
