// Screenshots reference pages at 3 breakpoints and extracts computed styles
// (font-family, size, weight, line-height, letter-spacing, color) from key
// elements, using the system's installed Chrome via puppeteer-core.
import puppeteer from "puppeteer-core";
import fs from "node:fs/promises";
import path from "node:path";

const CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const SHOTS_DIR = path.resolve(SCRIPT_DIR, "../scraped_data/screenshots");

const BREAKPOINTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const TARGETS = [
  {
    site: "creamix",
    url: "https://creamixcakes.com/",
    selectors: {
      h1: "h1",
      body: "p, .shop-product-form__title",
      button: "button, a.lp-button, .shop-product-form__submit",
    },
  },
  {
    site: "tor-gallery",
    url: "https://www.torcakesandevents.com/gallery",
    selectors: {
      h1: "h1",
      body: "p",
      button: "button",
    },
  },
];

async function getComputedStyleFor(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
    };
  }, selector);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const results = {};

  for (const target of TARGETS) {
    results[target.site] = { breakpoints: {}, styles: {} };
    const page = await browser.newPage();

    for (const bp of BREAKPOINTS) {
      await page.setViewport({ width: bp.width, height: bp.height });
      await page.goto(target.url, { waitUntil: "networkidle2", timeout: 60000 });

      const dir = path.join(SHOTS_DIR, target.site, bp.name);
      await fs.mkdir(dir, { recursive: true });
      const shotPath = path.join(dir, "page.png");
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`Screenshot: ${target.site}/${bp.name}`);

      if (bp.name === "desktop") {
        for (const [key, selector] of Object.entries(target.selectors)) {
          results[target.site].styles[key] = await getComputedStyleFor(page, selector);
        }
      }
    }
    await page.close();
  }

  await browser.close();

  await fs.mkdir(path.resolve(SCRIPT_DIR, "../scraped_data"), { recursive: true });
  await fs.writeFile(
    path.resolve(SCRIPT_DIR, "../scraped_data/extracted_styles.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("Wrote scraped_data/extracted_styles.json");
}

main();
