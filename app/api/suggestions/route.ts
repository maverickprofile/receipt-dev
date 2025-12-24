import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Resend } from "resend";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPPORT_EMAIL = "support@receipt.dev";
const FROM_EMAIL = "Receipt.dev <noreply@receipt.dev>";

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

        // Send email notification to support
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: SUPPORT_EMAIL,
                subject: `[Feature Suggestion] ${title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0;">💡 New Feature Suggestion</h1>
                        </div>
                        <div style="padding: 30px; background: #f9fafb;">
                            <h2 style="color: #1f2937; margin-top: 0;">${title}</h2>

                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;"><strong>Submitted by:</strong></td>
                                    <td style="padding: 10px 0; color: #1f2937; border-bottom: 1px solid #e5e7eb;">${userName || "Anonymous"}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;"><strong>Status:</strong></td>
                                    <td style="padding: 10px 0; color: #1f2937; border-bottom: 1px solid #e5e7eb;">
                                        <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px;">Pending</span>
                                    </td>
                                </tr>
                            </table>

                            ${description ? `
                                <h3 style="color: #1f2937;">Description</h3>
                                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${description}</p>
                                </div>
                            ` : ''}

                            <div style="margin-top: 24px; text-align: center;">
                                <a href="https://receipt.dev/en/suggest" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    View All Suggestions
                                </a>
                            </div>
                        </div>
                        <div style="padding: 20px; text-align: center; background: #e5e7eb;">
                            <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                This feature suggestion was submitted on Receipt.dev
                            </p>
                        </div>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error("Error sending suggestion notification email:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({ suggestion: result.rows[0] });
    } catch (error) {
        console.error("Error creating suggestion:", error);
        return NextResponse.json(
            { error: "Failed to create suggestion" },
            { status: 500 }
        );
    }
}
