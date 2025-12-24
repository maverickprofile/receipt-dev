import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";

/**
 * GET - Fetch user's credit balance and stats
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
            // Fetch user's credit balance
            const creditsResult = await client.query(
                `SELECT balance, total_earned, total_spent, created_at, updated_at
                 FROM user_credits_makereceipt
                 WHERE user_id = $1`,
                [userId]
            );

            // If no credits record exists (shouldn't happen with trigger, but handle gracefully)
            if (creditsResult.rows.length === 0) {
                return NextResponse.json({
                    balance: 0,
                    totalEarned: 0,
                    totalSpent: 0,
                    hasCredits: false,
                });
            }

            const credits = creditsResult.rows[0];

            // Check for active subscription
            const subscriptionResult = await client.query(
                `SELECT id, plan_type, status, credits_per_period, expires_at
                 FROM subscription_makereceipt
                 WHERE user_id = $1 AND status = 'active'
                 LIMIT 1`,
                [userId]
            );

            const hasActiveSubscription = subscriptionResult.rows.length > 0;
            const subscription = hasActiveSubscription ? subscriptionResult.rows[0] : null;

            return NextResponse.json({
                balance: credits.balance,
                totalEarned: credits.total_earned,
                totalSpent: credits.total_spent,
                hasCredits: credits.balance > 0,
                hasActiveSubscription,
                subscription: subscription ? {
                    planType: subscription.plan_type,
                    creditsPerPeriod: subscription.credits_per_period,
                    expiresAt: subscription.expires_at,
                } : null,
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching user credits:", error);
        return NextResponse.json(
            { error: "Failed to fetch credits" },
            { status: 500 }
        );
    }
}
