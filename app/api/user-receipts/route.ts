import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool, generateId } from "@/lib/db";
import { headers } from "next/headers";

/**
 * GET - Fetch all saved receipts for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        // Get session from better-auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const client = await pool.connect();

        try {
            const result = await client.query(
                `SELECT id, name, template_id, receipt_data, created_at, updated_at
                 FROM saved_receipt_makereceipt
                 WHERE user_id = $1
                 ORDER BY updated_at DESC`,
                [userId]
            );

            return NextResponse.json({ receipts: result.rows });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching user receipts:", error);
        return NextResponse.json(
            { error: "Failed to fetch receipts" },
            { status: 500 }
        );
    }
}

/**
 * POST - Create or update a saved receipt (upsert by ID)
 */
export async function POST(request: NextRequest) {
    try {
        // Get session from better-auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const body = await request.json();
        const { id, name, templateId, receiptData } = body;

        if (!name || !receiptData) {
            return NextResponse.json(
                { error: "Name and receiptData are required" },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // Check if receipt already exists for this user by template_id
            // This allows each user to have their own copy of each template
            const existing = await client.query(
                `SELECT id FROM saved_receipt_makereceipt
                 WHERE template_id = $1 AND user_id = $2`,
                [templateId || id, userId]
            );

            let result;

            if (existing.rows.length > 0) {
                // Update existing receipt for this user
                result = await client.query(
                    `UPDATE saved_receipt_makereceipt
                     SET name = $1, receipt_data = $2, updated_at = NOW()
                     WHERE template_id = $3 AND user_id = $4
                     RETURNING id, name, template_id, receipt_data, created_at, updated_at`,
                    [name, JSON.stringify(receiptData), templateId || id, userId]
                );
            } else {
                // Create new receipt with a unique ID per user
                const receiptId = generateId("rcpt");
                result = await client.query(
                    `INSERT INTO saved_receipt_makereceipt
                        (id, user_id, name, template_id, receipt_data)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING id, name, template_id, receipt_data, created_at, updated_at`,
                    [receiptId, userId, name, templateId || id, JSON.stringify(receiptData)]
                );
            }

            return NextResponse.json({ receipt: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error saving receipt:", error);
        return NextResponse.json(
            { error: "Failed to save receipt" },
            { status: 500 }
        );
    }
}
