import { chromium } from "playwright";
import sanitize from "sanitize-filename";
import sharp from "sharp";
import { setTimeout } from "timers/promises";

const VW = 1440;
const VH = 960;

const pageURL = "https://google.com/search?q=playwright";
const initialWait = 3000;
const scrollWait = 1500;
const headless = false;

(async () => {
  const browser = await chromium.launch({
    headless,
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: VW, height: VH });
  await page.goto(pageURL);
  await setTimeout(initialWait);

  const title = await page.title();

  const html = await page.locator("html");
  const height = await html.evaluate((el) => el.scrollHeight);
  let captures;
  if (height % VH === 0) {
    captures = new Array(height / VH).fill(VH);
  } else {
    captures = new Array(Math.floor(height / VH)).fill(VH);
    captures.push(height % VH);
  }

  const entries = [
    ...new Array(Math.floor(height / VH)).fill(VH),
    height % VH,
  ].filter((h) => h > 0);

  const compositeImages = [];
  for (const [i, h] of entries.entries()) {
    if (i !== 0) {
      await page.mouse.wheel(0, VH);
      await setTimeout(scrollWait);
    }
    compositeImages.push({
      input: await page.screenshot({
        clip: {
          x: 0,
          y: VH - h,
          width: VW,
          height: h,
        },
      }),
      gravity: "northwest",
      left: 0,
      top: i * VH,
    });
  }

  await page.mouse.wheel(0, -height);
  await setTimeout(scrollWait);

  await page.screenshot({
    path: `output/${sanitize(title)}_full.png`,
    fullPage: true,
  });

  await browser.close();

  sharp({
    create: {
      width: VW,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite(compositeImages)
    .toFile(`output/${sanitize(title)}.png`);
})();
