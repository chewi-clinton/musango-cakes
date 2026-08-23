// Scrapes a representative subset of product pages from creamixcakes.com as a
// STRUCTURAL reference only (layout patterns, image galleries, size-option shape).
// Prices/contact details are never used verbatim downstream — see the project plan.
import * as cheerio from "cheerio";
import fs from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const CATEGORIES = [
  "birthday-cakes-1761566388",
  "bridal-shower-cake-1775424136",
  "cupcakes-1767330678",
  "kids-cake-1761566453",
  "treats-1761566467",
  "wedding-cakes-1761566460",
];

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT_DIR = path.resolve(SCRIPT_DIR, "../scraped_data");
const IMG_DIR = path.resolve(SCRIPT_DIR, "../backend/media/products");

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

async function findProductUrls() {
  const urls = new Set();
  for (const cat of CATEGORIES) {
    const html = await fetchHtml(`https://creamixcakes.com/search?category=${cat}`);
    const $ = cheerio.load(html);
    let count = 0;
    $('a[href*="/products/"]').each((_, el) => {
      if (count >= 2) return;
      const href = $(el).attr("href");
      if (href && !urls.has(href)) {
        urls.add(href);
        count += 1;
      }
    });
  }
  return [...urls].slice(0, 10);
}

async function downloadImage(url, destName) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`image fetch failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.writeFile(path.join(IMG_DIR, destName), buf);
  return `products/${destName}`;
}

async function scrapeProduct(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const name = $(".shop-product-form__title").first().text().trim();
  const description = $('meta[name="description"]').attr("content") || "";
  const priceRangeText = $(".shop-product-form__price").first().text().trim();
  const sizes = $("select[data-sbn-variation-select] option")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t && !/choose/i.test(t));

  const images = [];
  $("img").each((_, el) => {
    const alt = $(el).attr("alt") || "";
    const src = $(el).attr("src");
    if (src && alt.startsWith(`${name} image`) && !images.includes(src)) {
      images.push(src);
    }
  });

  const slug = url.split("/products/")[1];
  const localImages = [];
  for (let i = 0; i < images.length; i += 1) {
    const ext = path.extname(new URL(images[i]).pathname) || ".jpg";
    const destName = `${slug}-${i + 1}${ext}`;
    try {
      const rel = await downloadImage(images[i], destName);
      localImages.push(rel);
    } catch (err) {
      console.error(`  ! image download failed: ${err.message}`);
    }
  }

  return {
    source_url: url,
    slug,
    name,
    description,
    reference_price_range_text: priceRangeText,
    sizes,
    images: localImages,
  };
}

async function main() {
  const urls = await findProductUrls();
  console.log(`Found ${urls.length} representative product URLs`);
  const products = [];
  for (const url of urls) {
    console.log(`Scraping ${url}`);
    try {
      products.push(await scrapeProduct(url));
    } catch (err) {
      console.error(`  ! failed: ${err.message}`);
    }
  }
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUT_DIR, "scraped_creamix.json"),
    JSON.stringify(products, null, 2)
  );
  console.log(`Wrote ${products.length} products to scraped_data/scraped_creamix.json`);
}

main();
