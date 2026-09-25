import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const requiredFiles = [
  "public/index.html",
  "public/privacy-policy/index.html",
  "public/terms/index.html",
  "public/data-deletion/index.html",
  "public/css/styles.css",
  "public/favicon.svg",
  "wrangler.toml",
  "README.md",
  ".gitignore",
  "package.json",
];

const requiredMeta = ["<title>", 'meta name="description"', 'name="viewport"'];
const requiredSections = ['class="site-header"', 'class="site-footer"', 'aria-label="Primary"'];

let failed = false;

function fail(message) {
  failed = true;
  console.error(`FAIL: ${message}`);
}

function ok(message) {
  console.log(`OK:   ${message}`);
}

async function exists(rel) {
  try {
    await access(path.join(root, rel), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const htmlPages = [
  "public/index.html",
  "public/privacy-policy/index.html",
  "public/terms/index.html",
  "public/data-deletion/index.html",
];

console.log("Validating desktopflow-legal static site...\n");

for (const file of requiredFiles) {
  if (await exists(file)) ok(`found ${file}`);
  else fail(`missing ${file}`);
}

const wrangler = await readFile(path.join(root, "wrangler.toml"), "utf8");
if (!wrangler.includes('directory = "./public"') && !wrangler.includes("directory = './public'")) {
  fail('wrangler.toml must set assets.directory to "./public"');
} else {
  ok("wrangler.toml assets directory is ./public");
}
if (/\bmain\s*=/.test(wrangler)) {
  fail("wrangler.toml must not set main= (assets-only; avoids Hello World Worker)");
} else {
  ok("wrangler.toml has no Worker main script (assets-only)");
}
if (!wrangler.includes("drop-trailing-slash")) {
  fail("wrangler.toml should use html_handling = drop-trailing-slash for /privacy-policy style routes");
} else {
  ok("wrangler.toml html_handling configured for direct legal routes");
}

const allHrefs = new Set();

for (const page of htmlPages) {
  const html = await readFile(path.join(root, page), "utf8");

  for (const token of requiredMeta) {
    if (!html.includes(token)) fail(`${page} missing ${token}`);
  }

  for (const token of requiredSections) {
    if (!html.includes(token)) fail(`${page} missing ${token}`);
  }

  if (!html.includes("/css/styles.css")) fail(`${page} missing stylesheet link`);
  if (!html.includes("favicon.svg")) fail(`${page} missing favicon`);
  if (!html.includes("DesktopFlow ERP")) fail(`${page} missing product name`);
  if (!html.includes("Awan Digital Solutions")) fail(`${page} missing company name`);
  if (/Hello world/i.test(html)) fail(`${page} unexpectedly contains Hello world`);

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith("#") || href.startsWith("http")) continue;
    allHrefs.add(href);
  }

  ok(`checked structure for ${page}`);
}

for (const href of allHrefs) {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;

  let rel = href.replace(/^\//, "");
  if (rel === "" || rel.endsWith("/")) rel = path.join(rel, "index.html");

  const publicRel = path.join("public", rel);
  if (!(await exists(publicRel))) fail(`broken internal link target: ${href} -> ${publicRel}`);
  else ok(`link resolves: ${href}`);
}

const css = await readFile(path.join(publicDir, "css/styles.css"), "utf8");
if (!css.includes("@media")) fail("styles.css missing responsive media queries");
else ok("responsive CSS media queries present");

if (failed) {
  console.error("\nValidation failed.");
  process.exit(1);
}

console.log("\nValidation passed. Static HTML/CSS site ready for Cloudflare Workers static assets.");
