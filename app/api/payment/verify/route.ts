import { NextRequest, NextResponse } from "next/server";
import { pool, generateId } from "@/lib/db";

const DODO_API_URL = "https://test.dodopayments.com";

/**
 * POST - Verify a payment and grant credits
 * Called when user returns from Dodo Payments with a successful payment
 */
export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        const body = await request.json();
        const { paymentId, userEmail } = body;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Payment configuration error" },
                { status: 500 }
            );
        }

        if (!paymentId || !userEmail) {
            return NextResponse.json(
                { error: "Payment ID and user email are required" },
                { status: 400 }
            );
        }

        console.log(`Verifying payment: ${paymentId} for user: ${userEmail}`);

        // Fetch payment details from Dodo
        const paymentResponse = await fetch(`${DODO_API_URL}/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!paymentResponse.ok) {
            console.error("Failed to fetch payment details:", await paymentResponse.text());
            return NextResponse.json(
                { error: "Failed to verify payment" },
                { status: 400 }
            );
        }

        const payment = await paymentResponse.json();
        console.log("Payment details:", JSON.stringify(payment, null, 2));

        // Check if payment is successful
        if (payment.status !== "succeeded" && payment.status !== "completed") {
            return NextResponse.json(
                { error: "Payment not successful", status: payment.status },
                { status: 400 }
            );
        }

        // Get product ID from payment
        const productId = payment.product_id || payment.product_cart?.[0]?.product_id;

        if (!productId) {
            console.error("No product ID in payment:", payment);
            return NextResponse.json(
                { error: "No product found in payment" },
                { status: 400 }
            );
        }

        // Fetch product details to get credits
        const productResponse = await fetch(`${DODO_API_URL}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        let creditsToGrant = 0;
        let planType = "Credits Pack";

        if (productResponse.ok) {
            const product = await productResponse.json();
            creditsToGrant = product.metadata?.credits || 0;
            planType = product.name || productId;
            console.log(`Product ${productId}: ${planType}, credits: ${creditsToGrant}`);
        }

        if (creditsToGrant <= 0) {
            // Default credits if not specified in product metadata
            creditsToGrant = 100;
            console.log("No credits in product metadata, using default:", creditsToGrant);
        }

        const client = await pool.connect();

        try {
            // Find user by email
            const userResult = await client.query(
                `SELECT id FROM user_makereceipt WHERE email = $1`,
                [userEmail]
            );

            if (userResult.rows.length === 0) {
                console.error(`User not found for email: ${userEmail}`);
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            const userId = userResult.rows[0].id;

            // Check if this payment was already processed
            const existingTx = await client.query(
                `SELECT id FROM credit_transactions_makereceipt WHERE reference_id = $1`,
                [paymentId]
            );

            if (existingTx.rows.length > 0) {
                console.log(`Payment ${paymentId} already processed`);
                // Get current balance to return
                const balanceResult = await client.query(
                    `SELECT balance FROM user_credits_makereceipt WHERE user_id = $1`,
                    [userId]
                );
                return NextResponse.json({
                    success: true,
                    alreadyProcessed: true,
                    balance: balanceResult.rows[0]?.balance || 0,
                });
            }

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
                    `Purchase: ${planType} - ${creditsToGrant} credits`,
                    paymentId,
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
                [subscriptionId, userId, planType, productId, paymentId, creditsToGrant]
            );

            await client.query('COMMIT');

            console.log(`Granted ${creditsToGrant} credits to user ${userId}. New balance: ${newBalance}`);

            return NextResponse.json({
                success: true,
                creditsGranted: creditsToGrant,
                newBalance,
                planType,
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
