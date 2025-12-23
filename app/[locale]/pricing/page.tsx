"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";

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
}

interface ProductsResponse {
    weekly: DodoProduct | null;
    monthly: DodoProduct | null;
    yearly: DodoProduct | null;
}

const FEATURES = [
    "No watermarks",
    "Unlimited receipt downloads",
    "100+ templates to choose from",
    "Save your own templates",
    "Unlimited customization",
];

function formatPrice(priceInCents: number, currency: string = "USD"): string {
    const price = priceInCents / 100;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
}

function getOriginalPrice(price: number, discount: number | null): number {
    if (!discount || discount === 0) return price;
    // Calculate original price before discount
    return Math.round(price / (1 - discount / 100));
}

function getPeriodLabel(plan: string): string {
    switch (plan) {
        case "weekly":
            return "/wk";
        case "monthly":
            return "/mo";
        case "yearly":
            return "/y";
        default:
            return "";
    }
}

function PricingCard({
    product,
    planType,
    isHighlighted = false,
    onCheckout,
    isLoading,
}: {
    product: DodoProduct;
    planType: string;
    isHighlighted?: boolean;
    onCheckout: (productId: string) => void;
    isLoading: boolean;
}) {
    const currentPrice = product.price.price;
    const discount = product.price.discount || 0;
    const originalPrice = getOriginalPrice(currentPrice, discount);
    const currency = product.price.currency || "USD";

    return (
        <Card
            className={`relative flex flex-col w-full max-w-[280px] sm:max-w-sm transition-all duration-300 hover:shadow-xl ${isHighlighted
                    ? "border-2 border-blue-500 shadow-lg md:scale-105"
                    : "border border-gray-200 hover:border-blue-300"
                }`}
        >
            {/* Sale Badge */}
            {discount > 0 && (
                <div className="absolute -top-0 left-0 right-0 mx-auto w-fit">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-b-lg shadow-md">
                        MEGA SALE - {discount}% OFF
                    </div>
                </div>
            )}

            <CardHeader className="text-center pt-10 sm:pt-12 pb-3 sm:pb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 capitalize">
                    {planType}
                </h3>

                {/* Pricing */}
                <div className="mt-3 sm:mt-4 flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                        {formatPrice(currentPrice, currency)}
                    </span>
                    {discount > 0 && (
                        <span className="text-base sm:text-lg text-gray-400 line-through">
                            {formatPrice(originalPrice, currency)}
                        </span>
                    )}
                    <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        {getPeriodLabel(planType)}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 px-4 sm:px-6">
                {/* Description from Dodo */}
                {product.description && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-3 sm:mb-4">
                        {product.description}
                    </p>
                )}

                {/* Features List */}
                <ul className="space-y-2 sm:space-y-3">
                    {FEATURES.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 sm:gap-3">
                            <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Button
                    onClick={() => onCheckout(product.product_id)}
                    disabled={isLoading}
                    className={`w-full py-4 sm:py-6 text-sm sm:text-base font-semibold transition-all ${isHighlighted
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                        }`}
                    variant={isHighlighted ? "default" : "outline"}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Get started"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

function PricingCardSkeleton() {
    return (
        <Card className="w-full max-w-sm animate-pulse">
            <CardHeader className="text-center pt-12 pb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
                <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
            </CardHeader>
            <CardContent className="px-6">
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="px-6 pb-6">
                <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardFooter>
        </Card>
    );
}

export default function PricingPage() {
    const [products, setProducts] = useState<ProductsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError("Unable to load pricing. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const handleCheckout = async (productId: string) => {
        setCheckoutLoading(productId);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error("Failed to create checkout session");
            }

            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            console.error("Checkout error:", err);
            setError("Failed to start checkout. Please try again.");
        } finally {
            setCheckoutLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 sm:py-16 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                        Remove watermark and enjoy unlimited receipts
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400">
                        Simple, transparent pricing, cancel any time.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-block bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
                            {error}
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-4 lg:gap-8">
                    {loading ? (
                        <>
                            <PricingCardSkeleton />
                            <PricingCardSkeleton />
                            <PricingCardSkeleton />
                        </>
                    ) : products ? (
                        <>
                            {products.weekly && (
                                <PricingCard
                                    product={products.weekly}
                                    planType="weekly"
                                    onCheckout={handleCheckout}
                                    isLoading={checkoutLoading === products.weekly.product_id}
                                />
                            )}
                            {products.monthly && (
                                <PricingCard
                                    product={products.monthly}
                                    planType="monthly"
                                    onCheckout={handleCheckout}
                                    isLoading={checkoutLoading === products.monthly.product_id}
                                />
                            )}
                            {products.yearly && (
                                <PricingCard
                                    product={products.yearly}
                                    planType="yearly"
                                    isHighlighted={true}
                                    onCheckout={handleCheckout}
                                    isLoading={checkoutLoading === products.yearly.product_id}
                                />
                            )}
                        </>
                    ) : null}
                </div>

                {/* Terms */}
                <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-8 sm:mt-12 px-4">
                    By clicking &quot;Get started&quot;, I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
