import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// POST - Vote on a suggestion
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { voteType, userId } = body;

        if (!voteType || !["up", "down"].includes(voteType)) {
            return NextResponse.json(
                { error: "Invalid vote type" },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        // Check if user already voted
        const existingVote = await client.query(
            `SELECT * FROM suggestion_vote_makereceipt 
             WHERE "suggestionId" = $1 AND "userId" = $2`,
            [id, userId || "anonymous"]
        );

        if (existingVote.rows.length > 0) {
            const oldVote = existingVote.rows[0];

            if (oldVote.voteType === voteType) {
                // Remove vote (toggle off)
                await client.query(
                    `DELETE FROM suggestion_vote_makereceipt WHERE id = $1`,
                    [oldVote.id]
                );

                // Update count
                const field = voteType === "up" ? "upvotes" : "downvotes";
                await client.query(
                    `UPDATE suggestion_makereceipt SET "${field}" = "${field}" - 1 WHERE id = $1`,
                    [id]
                );
            } else {
                // Change vote
                await client.query(
                    `UPDATE suggestion_vote_makereceipt SET "voteType" = $1 WHERE id = $2`,
                    [voteType, oldVote.id]
                );

                // Update counts
                if (voteType === "up") {
                    await client.query(
                        `UPDATE suggestion_makereceipt SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = $1`,
                        [id]
                    );
                } else {
                    await client.query(
                        `UPDATE suggestion_makereceipt SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id = $1`,
                        [id]
                    );
                }
            }
        } else {
            // New vote
            const voteId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            await client.query(
                `INSERT INTO suggestion_vote_makereceipt (id, "suggestionId", "userId", "voteType")
                 VALUES ($1, $2, $3, $4)`,
                [voteId, id, userId || "anonymous", voteType]
            );

            const field = voteType === "up" ? "upvotes" : "downvotes";
            await client.query(
                `UPDATE suggestion_makereceipt SET "${field}" = "${field}" + 1 WHERE id = $1`,
                [id]
            );
        }

        // Get updated suggestion
        const result = await client.query(
            `SELECT * FROM suggestion_makereceipt WHERE id = $1`,
            [id]
        );

        client.release();

        return NextResponse.json({ suggestion: result.rows[0] });
    } catch (error) {
        console.error("Error voting:", error);
        return NextResponse.json(
            { error: "Failed to vote" },
            { status: 500 }
        );
    }
}
