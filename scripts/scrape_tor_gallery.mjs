// Scrapes all gallery items from torcakesandevents.com/gallery (Next.js RSC page).
// The gallery data ships inside self.__next_f.push([...]) hydration payloads as
// escaped JSON strings; we unescape + concatenate them, then pull out each flat
// {id, img, cat, title, caption, date, w, h} item object.
import * as cheerio from "cheerio";
import fs from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const GALLERY_URL = "https://www.torcakesandevents.com/gallery";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT_DIR = path.resolve(SCRIPT_DIR, "../scraped_data");
const IMG_DIR = path.resolve(SCRIPT_DIR, "../backend/media/gallery");

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

function extractGalleryItems(html) {
  const $ = cheerio.load(html);
  let combined = "";

  $("script").each((_, el) => {
    const content = $(el).html() || "";
    const match = content.match(/self\.__next_f\.push\(\[1,"([\s\S]*)"\]\)/);
    if (!match) return;
    try {
      const unescaped = JSON.parse(`"${match[1]}"`);
      combined += unescaped;
    } catch {
      // not a clean single JSON-string payload; skip
    }
  });

  const itemPattern = /\{"id":"g\d+","img":"[^"]+","cat":"[^"]+","title":"[^"]+","caption":"(?:[^"\\]|\\.)*","date":"[^"]+","w":\d+,"h":\d+\}/g;
  const matches = combined.match(itemPattern) || [];
  const items = [];
  const seenIds = new Set();
  for (const m of matches) {
    try {
      const obj = JSON.parse(m);
      if (!seenIds.has(obj.id)) {
        seenIds.add(obj.id);
        items.push(obj);
      }
    } catch {
      // skip malformed match
    }
  }
  return items;
}

async function downloadImage(imgPath, destName) {
  const url = `https://www.torcakesandevents.com${imgPath}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`image fetch failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.writeFile(path.join(IMG_DIR, destName), buf);
  return `gallery/${destName}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const html = await fetchHtml(GALLERY_URL);
  const items = extractGalleryItems(html);
  console.log(`Found ${items.length} gallery items`);

  const categories = new Set();
  const output = [];
  let i = 0;
  for (const item of items) {
    i += 1;
    categories.add(item.cat);
    const ext = path.extname(item.img) || ".jpg";
    const destName = `${slugify(item.title)}-${item.id}${ext}`;
    try {
      const rel = await downloadImage(item.img, destName);
      output.push({
        id: item.id,
        title: item.title,
        category: item.cat,
        local_image: rel,
      });
    } catch (err) {
      console.error(`  ! [${i}/${items.length}] image failed for ${item.title}: ${err.message}`);
    }
    if (i % 25 === 0) console.log(`  ...${i}/${items.length} downloaded`);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUT_DIR, "scraped_tor_gallery.json"),
    JSON.stringify({ categories: [...categories], items: output }, null, 2)
  );
  console.log(`Wrote ${output.length} items across ${categories.size} categories`);
}

main();
