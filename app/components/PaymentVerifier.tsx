"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/components/ui/use-toast";

/**
 * Component that verifies payment when user returns from Dodo Payments
 * with payment_id and status=succeeded in URL params
 */
export default function PaymentVerifier() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const { toast } = useToast();
    const verifiedRef = useRef<string | null>(null);

    useEffect(() => {
        const paymentId = searchParams.get("payment_id");
        const status = searchParams.get("status");

        // Only verify if we have a successful payment and user is logged in
        if (paymentId && status === "succeeded" && session?.user?.email) {
            // Prevent duplicate verification
            if (verifiedRef.current === paymentId) {
                return;
            }
            verifiedRef.current = paymentId;

            const verifyPayment = async () => {
                try {
                    console.log("Verifying payment:", paymentId);

                    const response = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            paymentId,
                            userEmail: session.user.email,
                        }),
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        if (!data.alreadyProcessed) {
                            toast({
                                title: "Payment Successful!",
                                description: `${data.creditsGranted} credits have been added to your account.`,
                            });

                            // Notify other components to refresh credits
                            window.dispatchEvent(new CustomEvent("credits-changed"));
                        }

                        // Clean up URL params
                        const newUrl = pathname;
                        router.replace(newUrl);
                    } else {
                        console.error("Payment verification failed:", data.error);
                        if (!data.alreadyProcessed) {
                            toast({
                                title: "Payment Verification Issue",
                                description: "Please contact support if credits were not added.",
                                variant: "destructive",
                            });
                        }
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                }
            };

            verifyPayment();
        }
    }, [searchParams, session, toast, router, pathname]);

    return null; // This component doesn't render anything
}
