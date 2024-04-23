import type { APIRoute } from "astro";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

export const GET: APIRoute = async function get({}) {
  const browser = await puppeteer.launch();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const htmlTemplatePath = path.join(
    __dirname,
    "../../src/templates/hello-world.html"
  );
  try {
    const page = await browser.newPage();
    const htmlContent = await fs.readFile(htmlTemplatePath, "utf8");
    await page.setContent(htmlContent);
    const screenshotBuffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });
    return new Response(screenshotBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    await browser.close();
  }
};
