// Screenshots the local Next.js site at the same 3 breakpoints used for the
// reference sites, for side-by-side visual comparison.
import puppeteer from "puppeteer-core";
import fs from "node:fs/promises";
import path from "node:path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = "http://localhost:3001";
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const SHOTS_DIR = path.resolve(SCRIPT_DIR, "../scraped_data/screenshots/local");

const BREAKPOINTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const PAGES = [
  { name: "home", path: "/en" },
  { name: "cakes-birthday", path: "/en/cakes/birthday-cakes" },
  { name: "product", path: "/en/product/cake-slice" },
  { name: "shop", path: "/en/shop" },
  { name: "gallery", path: "/en/gallery" },
];

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();

  for (const target of PAGES) {
    for (const bp of BREAKPOINTS) {
      await page.setViewport({ width: bp.width, height: bp.height });
      await page.goto(`${BASE_URL}${target.path}`, { waitUntil: "networkidle2", timeout: 30000 });
      const dir = path.join(SHOTS_DIR, target.name, bp.name);
      await fs.mkdir(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, "page.png") });
      console.log(`Screenshot: ${target.name}/${bp.name}`);
    }
  }

  await browser.close();
}

main();
