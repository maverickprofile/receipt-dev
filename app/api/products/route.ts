import { NextResponse } from "next/server";

const DODO_API_URL = "https://test.dodopayments.com";
const PRODUCT_IDS = {
    weekly: "pdt_0NUcrKOHfDfgMBgvNsE8V",
    monthly: "pdt_0NUcrnfGY62HUM9CuVnvd",
    yearly: "pdt_0NUcrxS6VjCKdepxLMvDm",
};

interface DodoProduct {
    product_id: string;
    name: string;
    description: string | null;
    price: {
        price: number;
        currency: string;
        discount: number | null;
        type: string;
        billing_period?: string;
    };
    is_recurring: boolean;
    tax_inclusive: boolean;
}

async function fetchProduct(productId: string): Promise<DodoProduct | null> {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;

    if (!apiKey) {
        console.error("DODO_PAYMENTS_API_KEY is not configured");
        return null;
    }

    try {
        const response = await fetch(`${DODO_API_URL}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`Failed to fetch product ${productId}:`, response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return null;
    }
}

export async function GET() {
    try {
        const [weekly, monthly, yearly] = await Promise.all([
            fetchProduct(PRODUCT_IDS.weekly),
            fetchProduct(PRODUCT_IDS.monthly),
            fetchProduct(PRODUCT_IDS.yearly),
        ]);

        const products = {
            weekly,
            monthly,
            yearly,
        };

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
