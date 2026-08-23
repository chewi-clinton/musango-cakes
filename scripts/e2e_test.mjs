// Drives the real local dev servers (Next.js on :3001, Django on :8001) with a
// headless browser to verify end-to-end flows actually work, not just that
// pages compile. Watches console/network for errors throughout.
import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = "http://localhost:3001";

const errors = [];

async function interceptWhatsAppRedirect(page) {
  await page.setRequestInterception(true);
  return new Promise((resolve) => {
    page.on("request", (req) => {
      const url = req.url();
      if (url.startsWith("https://wa.me") || url.startsWith("whatsapp://")) {
        req.abort();
        resolve(url);
        return;
      }
      req.continue();
    });
  });
}

function watch(page, label) {
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console:${label}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror:${label}] ${err.message}`));
  page.on("requestfailed", (req) => {
    if (!req.url().startsWith("https://wa.me")) {
      errors.push(`[requestfailed:${label}] ${req.url()} - ${req.failure()?.errorText}`);
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().startsWith("https://wa.me")) {
      errors.push(`[http${res.status()}:${label}] ${res.url()}`);
    }
  });
}

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const results = [];

  // --- Flow 1: shop browse -> cart -> checkout ---
  {
    const page = await browser.newPage();
    watch(page, "shop-flow");
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });
    results.push(`home loaded: ${page.url()}`);

    await page.goto(`${BASE_URL}/en/cakes/birthday-cakes`, { waitUntil: "networkidle2" });
    const productLinkCount = await page.$$eval('a[href*="/product/"]', (els) => els.length);
    results.push(`birthday-cakes category product links: ${productLinkCount}`);

    await page.goto(`${BASE_URL}/en/product/cake-slice`, { waitUntil: "networkidle2" });
    const addToCartBtn = await page.$("button ::-p-text(Add to Cart)");
    if (!addToCartBtn) throw new Error("Add to Cart button not found on product page");
    await addToCartBtn.click();
    await page.waitForFunction(() => window.location.pathname.includes("/cart"), { timeout: 5000 });
    results.push(`after add-to-cart, landed on: ${page.url()}`);

    const cartItemText = await page.$eval("body", (el) => el.innerText);
    if (!cartItemText.includes("Cake Slice")) throw new Error("Cart page does not show added item");
    results.push("cart shows added item: OK");

    await page.goto(`${BASE_URL}/en/checkout`, { waitUntil: "networkidle2" });
    await page.type('input[required]', "Test Customer");
    const inputs = await page.$$("input[required]");
    await inputs[1].type("670000000");
    const waRedirectPromise = interceptWhatsAppRedirect(page);
    await page.click('button[type="submit"]');
    const waUrl = await Promise.race([
      waRedirectPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("checkout: no wa.me redirect within 8s")), 8000)),
    ]);
    results.push(`checkout redirected to WhatsApp: ${waUrl}`);
    if (!waUrl.includes("text=")) throw new Error("wa.me link missing order text");

    await page.close();
  }

  // --- Flow 2: custom order wizard ---
  {
    const page = await browser.newPage();
    watch(page, "order-wizard");
    await page.goto(`${BASE_URL}/en/order`, { waitUntil: "networkidle2" });

    await page.click('button ::-p-text(6")');
    await page.click("button.mt-6"); // Next
    await page.waitForFunction(() => document.body.innerText.includes("Choose flavor"));

    await page.click('button ::-p-text(Chocolate)');
    await page.click("button.mt-6");
    await page.waitForFunction(() => document.body.innerText.includes("Choose design"));

    await page.click("button.mt-6"); // skip design text, go next
    await page.waitForFunction(() => document.body.innerText.includes("Choose date"));

    await page.evaluate(() => {
      const input = document.querySelector('input[type="date"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, "2026-12-25");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.click("button.mt-6");
    await page.waitForFunction(() => document.body.innerText.includes("Delivery or pickup"));

    await page.click('button ::-p-text(delivery)');
    const nameInputs = await page.$$("input[required]");
    await nameInputs[0].type("Test Customer 2");
    await nameInputs[1].type("671111111");
    const waRedirectPromise2 = interceptWhatsAppRedirect(page);
    await page.click('button[type="submit"]');
    const waUrl2 = await Promise.race([
      waRedirectPromise2,
      new Promise((_, reject) => setTimeout(() => reject(new Error("order wizard: no wa.me redirect within 8s")), 8000)),
    ]);
    results.push(`order wizard redirected to WhatsApp: ${waUrl2}`);

    await page.close();
  }

  // --- Flow 3: gallery filters ---
  {
    const page = await browser.newPage();
    watch(page, "gallery-filters");
    await page.goto(`${BASE_URL}/en/gallery`, { waitUntil: "networkidle2" });
    const allCount = await page.$$eval("img", (els) => els.length);

    await page.goto(`${BASE_URL}/en/gallery?category=wedding`, { waitUntil: "networkidle2" });
    const weddingCount = await page.$$eval("img", (els) => els.length);
    results.push(`gallery all=${allCount} images, wedding filter=${weddingCount} images`);
    if (weddingCount >= allCount) throw new Error("Gallery category filter did not reduce results");

    await page.close();
  }

  // --- Flow 4: language toggle ---
  {
    const page = await browser.newPage();
    watch(page, "language-toggle");
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });
    const enText = await page.$eval("h1", (el) => el.textContent);

    await page.goto(`${BASE_URL}/fr`, { waitUntil: "networkidle2" });
    const frText = await page.$eval("h1", (el) => el.textContent);
    results.push(`en h1: "${enText}" | fr h1: "${frText}"`);
    if (enText === frText) throw new Error("French locale did not change homepage h1 text");

    await page.close();
  }

  await browser.close();

  console.log("\n=== RESULTS ===");
  results.forEach((r) => console.log("OK:", r));

  console.log("\n=== ERRORS ===");
  if (errors.length === 0) {
    console.log("None detected.");
  } else {
    errors.forEach((e) => console.log(e));
  }
}

main().catch((err) => {
  console.error("E2E TEST FAILED:", err.message);
  console.log("\n=== ERRORS SO FAR ===");
  errors.forEach((e) => console.log(e));
  process.exit(1);
});
