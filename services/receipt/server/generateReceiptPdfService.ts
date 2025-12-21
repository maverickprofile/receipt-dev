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
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inconsolata:wght@400;500;600;700&family=Libre+Barcode+39&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Roboto Mono', monospace; 
              background: white;
              display: flex;
              justify-content: center;
              padding: 0; /* Removed padding to fit thermal receipts exactly */
              margin: 0;
              /* Define variable manually for PDF context since layout isn't present */
              --font-libre-barcode-39: 'Libre Barcode 39', cursive;
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
      waitUntil: "load",
      timeout: 30000,
    });

    await page.addStyleTag({
      url: TAILWIND_CDN,
    });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Calculate height for thermal receipts
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

    // Determine PDF options based on size
    let pdfOptions: any = {
      printBackground: true,
      preferCSSPageSize: true, // Respect @page CSS
    };

    if (body.settings.pdfSize === "A4") {
      pdfOptions.format = "A4";
    } else {
      // For thermal receipts (80mm, 110mm), use visual viewport width and dynamic height
      // Disable CSS page size preference to FORCE manual width/height
      pdfOptions.preferCSSPageSize = false;

      const widthStr = body.settings.pdfSize; // "80mm" or "110mm"
      const widthPx = widthStr === "80mm" ? 302 : 415; // Approx 96 DPI: 80mm ~ 302px, 110mm ~ 415px

      // Set viewport to match thermal printer width to ensure correct reflow/centering
      await page.setViewport({ width: widthPx, height: 800 });

      // Recalculate height with new viewport
      const newBodyHeight = await page.evaluate(() => document.body.scrollHeight);

      pdfOptions.width = widthStr;
      pdfOptions.height = newBodyHeight + 2 + "px"; // Exact fit with small buffer
      pdfOptions.pageRanges = "1";
    }

    const pdf: Uint8Array = await page.pdf(pdfOptions);

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

