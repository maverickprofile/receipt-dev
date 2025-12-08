import { NextRequest, NextResponse } from "next/server";

// Chromium
import chromium from "@sparticuz/chromium";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/variables";

// Types
import type { ReceiptType } from "@/lib/receipt-schemas";

/**
 * Generate a PDF document of a receipt based on the provided data.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generateReceiptPdfService(req: NextRequest) {
  const body: ReceiptType = await req.json();
  let browser;
  let page;

  try {
    const ReactDOMServer = (await import("react-dom/server")).default;
    const { ReceiptTemplate } = await import(
      "@/app/components/templates/receipt/ReceiptTemplate"
    );

    const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
      ReceiptTemplate({ receipt: body })
    );

    // Full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inconsolata:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Roboto Mono', monospace; 
              background: white;
              display: flex;
              justify-content: center;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${htmlTemplate}
        </body>
      </html>
    `;

    if (ENV === "production") {
      const puppeteer = (await import("puppeteer-core")).default;
      browser = await puppeteer.launch({
        args: [...chromium.args, "--disable-dev-shm-usage", "--ignore-certificate-errors"],
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      });
    }

    if (!browser) {
      throw new Error("Failed to launch browser");
    }

    page = await browser.newPage();
    await page.setContent(fullHtml, {
      waitUntil: ["networkidle0", "load", "domcontentloaded"],
      timeout: 30000,
    });

    await page.addStyleTag({
      url: TAILWIND_CDN,
    });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    const pdf: Uint8Array = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return new NextResponse(new Blob([pdf], { type: "application/pdf" }), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${body.name || "receipt"}.pdf`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Receipt PDF Generation Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate receipt PDF" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error("Error closing page:", e);
      }
    }
    if (browser) {
      try {
        const pages = await browser.pages();
        await Promise.all(pages.map((p) => p.close()));
        await browser.close();
      } catch (e) {
        console.error("Error closing browser:", e);
      }
    }
  }
}

