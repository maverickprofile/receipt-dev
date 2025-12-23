import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// GET - Fetch comments for a suggestion
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const client = await pool.connect();

        const result = await client.query(
            `SELECT * FROM suggestion_comment_makereceipt 
             WHERE "suggestionId" = $1 
             ORDER BY "createdAt" ASC`,
            [id]
        );

        client.release();

        return NextResponse.json({ comments: result.rows });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST - Add a comment to a suggestion
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { content, userId, userName, userImage } = body;

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        const commentId = `com_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const result = await client.query(
            `INSERT INTO suggestion_comment_makereceipt 
                (id, "suggestionId", "userId", "userName", "userImage", content)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [commentId, id, userId || null, userName || "Anon", userImage || null, content]
        );

        client.release();

        return NextResponse.json({ comment: result.rows[0] });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { error: "Failed to add comment" },
            { status: 500 }
        );
    }
}
