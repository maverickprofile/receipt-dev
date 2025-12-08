import { NextRequest } from "next/server";
import { generateReceiptPdfService } from "@/services/receipt/server/generateReceiptPdfService";

/**
 * Handles POST requests to generate a receipt PDF.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
export async function POST(req: NextRequest) {
  return generateReceiptPdfService(req);
}

