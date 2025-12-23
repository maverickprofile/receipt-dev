import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// GET - Fetch all suggestions
export async function GET() {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT 
                s.*,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object(
                            'id', c.id,
                            'content', c.content,
                            'userName', c."userName",
                            'userImage', c."userImage",
                            'createdAt', c."createdAt"
                        ) ORDER BY c."createdAt" ASC
                    )
                    FROM suggestion_comment_makereceipt c
                    WHERE c."suggestionId" = s.id),
                    '[]'::json
                ) as comments
            FROM suggestion_makereceipt s
            ORDER BY s."upvotes" DESC, s."createdAt" DESC
        `);

        client.release();

        return NextResponse.json({ suggestions: result.rows });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return NextResponse.json(
            { error: "Failed to fetch suggestions" },
            { status: 500 }
        );
    }
}

// POST - Create a new suggestion
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, userId, userName, userImage } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        const id = `sug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const result = await client.query(
            `INSERT INTO suggestion_makereceipt 
                (id, title, description, "userId", "userName", "userImage", status, upvotes, downvotes)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending', 0, 0)
             RETURNING *`,
            [id, title, description || "", userId || null, userName || "Anon", userImage || null]
        );

        client.release();

        return NextResponse.json({ suggestion: result.rows[0] });
    } catch (error) {
        console.error("Error creating suggestion:", error);
        return NextResponse.json(
            { error: "Failed to create suggestion" },
            { status: 500 }
        );
    }
}
