import { NextRequest, NextResponse } from "next/server";
import { pool, generateId } from "@/lib/db";

const DODO_API_URL = "https://test.dodopayments.com";

/**
 * POST - Handle Dodo Payments webhook events
 * Called when a payment succeeds to grant credits to user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;

        console.log("Dodo webhook received:", JSON.stringify(body, null, 2));

        // Extract event data
        const { event_type, data } = body;

        // Only handle successful payment events
        if (event_type !== "payment.succeeded" && event_type !== "subscription.created") {
            console.log(`Ignoring event type: ${event_type}`);
            return NextResponse.json({ received: true, processed: false });
        }

        const { payment_id, product_id, customer_email, subscription_id } = data || {};

        if (!product_id || !customer_email) {
            console.error("Missing product_id or customer_email in webhook data");
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 }
            );
        }

        // Fetch product details from Dodo to get credits metadata
        let creditsToGrant = 0;
        let planType = "unknown";

        if (apiKey) {
            try {
                const productResponse = await fetch(`${DODO_API_URL}/products/${product_id}`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });

                if (productResponse.ok) {
                    const product = await productResponse.json();
                    // Get credits from product metadata
                    creditsToGrant = product.metadata?.credits || 0;
                    planType = product.name || product_id;
                    console.log(`Product ${product_id}: ${planType}, credits: ${creditsToGrant}`);
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        }

        if (creditsToGrant <= 0) {
            console.log("No credits to grant for this product");
            return NextResponse.json({ received: true, processed: false, reason: "no_credits_in_product" });
        }

        const client = await pool.connect();

        try {
            // Find user by email
            const userResult = await client.query(
                `SELECT id FROM user_makereceipt WHERE email = $1`,
                [customer_email]
            );

            if (userResult.rows.length === 0) {
                console.error(`User not found for email: ${customer_email}`);
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            const userId = userResult.rows[0].id;

            // Start transaction
            await client.query('BEGIN');

            // Add credits to user's balance
            const updateResult = await client.query(
                `UPDATE user_credits_makereceipt
                 SET balance = balance + $1,
                     total_earned = total_earned + $1,
                     updated_at = NOW()
                 WHERE user_id = $2
                 RETURNING balance`,
                [creditsToGrant, userId]
            );

            // If no credits record exists, create one
            let newBalance = creditsToGrant;
            if (updateResult.rowCount === 0) {
                const insertResult = await client.query(
                    `INSERT INTO user_credits_makereceipt
                        (id, user_id, balance, total_earned, total_spent)
                     VALUES ($1, $2, $3, $3, 0)
                     RETURNING balance`,
                    [generateId("cred"), userId, creditsToGrant]
                );
                newBalance = insertResult.rows[0].balance;
            } else {
                newBalance = updateResult.rows[0].balance;
            }

            // Log the transaction
            const txId = generateId("tx");
            await client.query(
                `INSERT INTO credit_transactions_makereceipt
                    (id, user_id, amount, balance_after, transaction_type, description, reference_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    txId,
                    userId,
                    creditsToGrant,
                    newBalance,
                    'purchase',
                    `Subscription: ${planType} - ${creditsToGrant} credits`,
                    payment_id || subscription_id || null,
                ]
            );

            // Create or update subscription record
            const subscriptionId = generateId("sub");
            await client.query(
                `INSERT INTO subscription_makereceipt
                    (id, user_id, plan_type, status, dodo_product_id, dodo_payment_id, credits_per_period, started_at, last_credit_grant_at)
                 VALUES ($1, $2, $3, 'active', $4, $5, $6, NOW(), NOW())
                 ON CONFLICT (user_id) DO UPDATE SET
                    plan_type = $3,
                    status = 'active',
                    dodo_product_id = $4,
                    dodo_payment_id = $5,
                    credits_per_period = $6,
                    last_credit_grant_at = NOW()`,
                [subscriptionId, userId, planType, product_id, payment_id || subscription_id, creditsToGrant]
            );

            await client.query('COMMIT');

            console.log(`Granted ${creditsToGrant} credits to user ${userId}. New balance: ${newBalance}`);

            return NextResponse.json({
                received: true,
                processed: true,
                creditsGranted: creditsToGrant,
                newBalance,
                userId,
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

// GET endpoint for testing/verification
export async function GET(request: NextRequest) {
    return NextResponse.json({ status: "Dodo webhook endpoint active" });
}
