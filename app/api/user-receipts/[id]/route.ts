import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET - Fetch a single saved receipt by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

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
                 WHERE id = $1 AND user_id = $2`,
                [id, userId]
            );

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: "Receipt not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ receipt: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching receipt:", error);
        return NextResponse.json(
            { error: "Failed to fetch receipt" },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Delete a saved receipt by ID
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

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
                `DELETE FROM saved_receipt_makereceipt
                 WHERE id = $1 AND user_id = $2
                 RETURNING id`,
                [id, userId]
            );

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: "Receipt not found or already deleted" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ success: true, deletedId: id });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error deleting receipt:", error);
        return NextResponse.json(
            { error: "Failed to delete receipt" },
            { status: 500 }
        );
    }
}
