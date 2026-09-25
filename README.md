# DesktopFlow ERP — Public Legal Website

Static public website for **DesktopFlow ERP** by **Awan Digital Solutions**.

Repository: [https://github.com/rehan120/desktopflow-legal](https://github.com/rehan120/desktopflow-legal)

This project is **independent** of the DesktopFlow ERP application. It provides the public HTTPS pages commonly required for Meta app review and publishing.

It contains **no** API keys, Meta App Secrets, WhatsApp access tokens, webhook tokens, passwords, or other secrets.

## Project type

**Plain HTML + CSS** (static site).

- Not React
- Not Vite
- Not Next.js
- No application framework build

Site files live in `public/`. Cloudflare Workers serves them via **Static Assets** (`wrangler.toml`).

## Public pages

| Path | Purpose |
|------|---------|
| `/` | Product landing page |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/data-deletion` | Data Deletion Instructions |

## Run locally

```bash
npm start
```

This serves the `public/` folder at http://localhost:4173/

Verify:

- http://localhost:4173/
- http://localhost:4173/privacy-policy/
- http://localhost:4173/terms/
- http://localhost:4173/data-deletion/
- http://localhost:4173/css/styles.css

Optional validation:

```bash
npm run validate
```

Optional Cloudflare local preview (Workers static assets):

```bash
npm run dev:cf
```

## Build

**No build step is required.**

Build command for Cloudflare: leave empty (or `exit 0` if the UI requires a value).

## Deploy with Cloudflare Workers Static Assets

Production previously showed **Hello world** because a default Worker starter was deployed instead of these static files. This repo is configured as an **assets-only** Worker that serves `./public`.

### Exact Cloudflare settings

| Setting | Value |
|--------|--------|
| Config file | `wrangler.toml` |
| Worker name | `desktopflow-legal` |
| Asset directory | `./public` |
| Worker `main` script | **none** (assets-only; do not keep Hello World) |
| HTML handling | `drop-trailing-slash` |
| Build command | *(empty)* / none |
| Deploy command | `npx wrangler deploy` |
| Environment variables / secrets | none |

### Deploy from your machine (after login)

```bash
npx wrangler login
npm run deploy
```

### Deploy from Cloudflare Git integration

1. Open the existing Worker project in Cloudflare (the one showing Hello world).
2. Connect it to `rehan120/desktopflow-legal` **or** redeploy from a machine with Wrangler after pushing this config.
3. Ensure deploy uses **`npx wrangler deploy`** with this repository’s `wrangler.toml`.
4. Do **not** keep a Hello World `src/index.js` / `main` Worker entrypoint in the project.
5. Build command: empty.
6. No secrets required.
7. Redeploy, then verify the four routes on the `*.workers.dev` / custom domain URL.

### After deploy, verify

- `https://<your-domain>/`
- `https://<your-domain>/privacy-policy`
- `https://<your-domain>/terms`
- `https://<your-domain>/data-deletion`
- CSS and header/footer navigation on each page

## Routing note (Cloudflare Workers)

Use folder `index.html` files plus:

```toml
html_handling = "drop-trailing-slash"
```

Do **not** add `public/_redirects` rules that send `/privacy-policy` → `/privacy-policy/`. Those conflict with `drop-trailing-slash` and create a redirect loop (301 ↔ 307), so the legal URLs never settle on HTTP 200.

## Git push steps (manual — do not skip review)

```bash
cd desktopflow-legal
git status
git add .
git commit -m "Configure Cloudflare Workers static assets for legal site"
git push origin main
```

Then run `npm run deploy` (or trigger the linked Cloudflare Git deploy).

## Project structure

```text
desktopflow-legal/
├── public/
│   ├── index.html
│   ├── privacy-policy/index.html
│   ├── terms/index.html
│   ├── data-deletion/index.html
│   ├── css/styles.css
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── wrangler.toml
├── package.json
├── scripts/validate.mjs
└── README.md
```
