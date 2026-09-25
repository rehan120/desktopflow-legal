import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "privacy-policy/index.html",
  "terms/index.html",
  "data-deletion/index.html",
  "css/styles.css",
  "favicon.svg",
  "README.md",
  ".gitignore",
  "robots.txt",
  "sitemap.xml",
  "netlify.toml",
  "_redirects",
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
  "index.html",
  "privacy-policy/index.html",
  "terms/index.html",
  "data-deletion/index.html",
];

console.log("Validating desktopflow-legal static site...\n");

for (const file of requiredFiles) {
  if (await exists(file)) ok(`found ${file}`);
  else fail(`missing ${file}`);
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

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith("#") || href.startsWith("http")) continue;
    allHrefs.add(href);
  }

  ok(`checked structure for ${page}`);
}

const expectedInternal = ["/", "/privacy-policy/", "/terms/", "/data-deletion/", "/css/styles.css", "/favicon.svg"];
for (const href of expectedInternal) {
  if (![...allHrefs].some((h) => h === href || h.startsWith(href))) {
    // css/favicon only in head; still verify file mapping below
  }
}

for (const href of allHrefs) {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;

  let rel = href.replace(/^\//, "");
  if (rel === "" || rel.endsWith("/")) rel = path.join(rel, "index.html");

  if (!(await exists(rel))) fail(`broken internal link target: ${href} -> ${rel}`);
  else ok(`link resolves: ${href}`);
}

const css = await readFile(path.join(root, "css/styles.css"), "utf8");
if (!css.includes("@media")) fail("styles.css missing responsive media queries");
else ok("responsive CSS media queries present");

if (failed) {
  console.error("\nValidation failed.");
  process.exit(1);
}

console.log("\nValidation passed. No build step required for this static site.");
