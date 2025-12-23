import { NextRequest, NextResponse } from "next/server";

const DODO_API_URL = "https://test.dodopayments.com";

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Payment configuration error" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { productId, customerEmail } = body;

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Create a checkout session with Dodo Payments using the /checkouts endpoint
        const response = await fetch(`${DODO_API_URL}/checkouts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_cart: [
                    {
                        product_id: productId,
                        quantity: 1,
                    },
                ],
                payment_link: true,
                return_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/`,
                customer: customerEmail
                    ? {
                        email: customerEmail,
                    }
                    : undefined,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Dodo Payments error:", errorData);
            return NextResponse.json(
                { error: "Failed to create checkout session" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            checkoutUrl: data.url || data.checkout_url,
            paymentId: data.payment_id,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
