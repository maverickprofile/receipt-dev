import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool, generateId } from "@/lib/db";
import { headers } from "next/headers";
import { CREDITS_PER_DOWNLOAD } from "@/lib/variables";

/**
 * POST - Deduct credits for a download
 * Uses atomic update with row-level locking to prevent race conditions
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
        const { downloadType, referenceId } = body;

        if (!downloadType || !['pdf', 'image'].includes(downloadType)) {
            return NextResponse.json(
                { error: "Invalid downloadType. Must be 'pdf' or 'image'" },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // Start transaction
            await client.query('BEGIN');

            // Check for active subscription first
            const subscriptionResult = await client.query(
                `SELECT id FROM subscription_makereceipt
                 WHERE user_id = $1 AND status = 'active'
                 LIMIT 1`,
                [userId]
            );

            // If user has active subscription, allow download without deducting credits
            if (subscriptionResult.rows.length > 0) {
                await client.query('COMMIT');
                return NextResponse.json({
                    success: true,
                    creditDeducted: false,
                    reason: 'active_subscription',
                    message: 'Download allowed - active subscription',
                });
            }

            // Atomic update: Only deduct if balance >= CREDITS_PER_DOWNLOAD
            const updateResult = await client.query(
                `UPDATE user_credits_makereceipt
                 SET balance = balance - $1,
                     total_spent = total_spent + $1,
                     updated_at = NOW()
                 WHERE user_id = $2 AND balance >= $1
                 RETURNING balance`,
                [CREDITS_PER_DOWNLOAD, userId]
            );

            // If no rows updated, insufficient credits
            if (updateResult.rowCount === 0) {
                await client.query('ROLLBACK');

                // Get current balance for error response
                const balanceResult = await client.query(
                    `SELECT balance FROM user_credits_makereceipt WHERE user_id = $1`,
                    [userId]
                );

                const currentBalance = balanceResult.rows[0]?.balance ?? 0;

                return NextResponse.json(
                    {
                        error: "insufficient_credits",
                        currentBalance,
                        required: CREDITS_PER_DOWNLOAD,
                        message: `You need ${CREDITS_PER_DOWNLOAD} credits to download. Current balance: ${currentBalance}`,
                    },
                    { status: 402 } // Payment Required
                );
            }

            const newBalance = updateResult.rows[0].balance;

            // Log the transaction
            const txId = generateId("tx");
            await client.query(
                `INSERT INTO credit_transactions_makereceipt
                    (id, user_id, amount, balance_after, transaction_type, description, reference_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    txId,
                    userId,
                    -CREDITS_PER_DOWNLOAD,
                    newBalance,
                    'download',
                    `Downloaded ${downloadType.toUpperCase()}`,
                    referenceId || null,
                ]
            );

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                creditDeducted: true,
                creditsUsed: CREDITS_PER_DOWNLOAD,
                newBalance,
                transactionId: txId,
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error deducting credits:", error);
        return NextResponse.json(
            { error: "Failed to process credit deduction" },
            { status: 500 }
        );
    }
}
