"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CreditCard, Receipt, HelpCircle, ExternalLink } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function BillingPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                            Billing & Subscription
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage your subscription and view billing history
                        </p>
                    </div>

                    {/* Current Plan Card */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                        No plan
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        Upgrade to access premium features
                                    </p>
                                </div>
                                <Link href="/pricing">
                                    <Button variant="outline">
                                        Purchase a plan
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing History Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Billing History</CardTitle>
                            <CardDescription>Your recent payments and invoices</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Empty State */}
                            <div className="text-center py-8">
                                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="font-medium text-slate-600 dark:text-slate-400">
                                    No billing history found
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Your payment history will appear here after your first purchase
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Need Help Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                Need Help?
                            </CardTitle>
                            <CardDescription>Questions about billing or subscriptions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                If you have questions about your billing or need to make changes to your
                                subscription, you can manage everything through the{" "}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    customer portal
                                </a>
                                .
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                For additional support, please contact us through{" "}
                                <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                                    our support channels
                                </Link>
                                .
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-4 mt-12">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-6 h-6 text-blue-500" />
                            <span className="text-xl font-bold">MakeReceipt</span>
                        </div>
                        <p className="text-slate-400 max-w-md">
                            Make receipts with custom information from selected templates in seconds!
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-8 text-sm">
                        <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                            Receipt Maker
                        </Link>
                        <Link href="/templates" className="text-slate-300 hover:text-white transition-colors">
                            Templates
                        </Link>
                        <Link href="/examples" className="text-slate-300 hover:text-white transition-colors">
                            Examples
                        </Link>
                        <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
                            Blog
                        </Link>
                        <Link href="/receipt/generate/default" className="text-slate-300 hover:text-white transition-colors">
                            Generate Receipt
                        </Link>
                        <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>

                    <div className="border-t border-slate-700 pt-8">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} MakeReceipt. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
