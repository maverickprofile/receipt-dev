import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool, generateId } from "@/lib/db";
import { headers } from "next/headers";

/**
 * GET - Fetch download history for the authenticated user
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
                `SELECT id, receipt_id, template_id, template_name, download_type, downloaded_at
                 FROM download_history_makereceipt
                 WHERE user_id = $1
                 ORDER BY downloaded_at DESC
                 LIMIT 50`,
                [userId]
            );

            return NextResponse.json({ downloads: result.rows });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching download history:", error);
        return NextResponse.json(
            { error: "Failed to fetch download history" },
            { status: 500 }
        );
    }
}

/**
 * POST - Record a new download event
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
        const { receiptId, templateId, templateName, downloadType } = body;

        if (!downloadType || !["pdf", "image"].includes(downloadType)) {
            return NextResponse.json(
                { error: "Valid downloadType (pdf or image) is required" },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            const downloadId = generateId("dl");

            const result = await client.query(
                `INSERT INTO download_history_makereceipt
                    (id, user_id, receipt_id, template_id, template_name, download_type)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, receipt_id, template_id, template_name, download_type, downloaded_at`,
                [downloadId, userId, receiptId || null, templateId || null, templateName || "Untitled", downloadType]
            );

            return NextResponse.json({ download: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error recording download:", error);
        return NextResponse.json(
            { error: "Failed to record download" },
            { status: 500 }
        );
    }
}
