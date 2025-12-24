"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Download, BookmarkCheck, Loader2, Coins, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import SavedReceiptCard from "@/app/components/profile/SavedReceiptCard";
import DownloadHistoryItem from "@/app/components/profile/DownloadHistoryItem";
import { useCredits } from "@/hooks/useCredits";
import { CREDITS_PER_DOWNLOAD } from "@/lib/variables";

interface SavedReceiptRecord {
    id: string;
    name: string;
    template_id: string | null;
    receipt_data: any;
    created_at: string;
    updated_at: string;
}

interface DownloadRecord {
    id: string;
    receipt_id: string | null;
    template_id: string | null;
    template_name: string | null;
    download_type: "pdf" | "image";
    downloaded_at: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || "en";
    const { data: session, isPending } = useSession();
    const { credits, isLoading: creditsLoading } = useCredits();

    // Data state
    const [savedReceipts, setSavedReceipts] = useState<SavedReceiptRecord[]>([]);
    const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>([]);
    const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
    const [isLoadingDownloads, setIsLoadingDownloads] = useState(true);

    // Fetch saved receipts
    const fetchSavedReceipts = useCallback(async () => {
        try {
            setIsLoadingReceipts(true);
            const response = await fetch("/api/user-receipts");
            if (response.ok) {
                const data = await response.json();
                setSavedReceipts(data.receipts || []);
            }
        } catch (error) {
            console.error("Error fetching saved receipts:", error);
        } finally {
            setIsLoadingReceipts(false);
        }
    }, []);

    // Fetch download history
    const fetchDownloadHistory = useCallback(async () => {
        try {
            setIsLoadingDownloads(true);
            const response = await fetch("/api/user-downloads");
            if (response.ok) {
                const data = await response.json();
                setDownloadHistory(data.downloads || []);
            }
        } catch (error) {
            console.error("Error fetching download history:", error);
        } finally {
            setIsLoadingDownloads(false);
        }
    }, []);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/${locale}/sign-in`);
        }
    }, [session, isPending, router, locale]);

    // Fetch data when authenticated
    useEffect(() => {
        if (session?.user) {
            fetchSavedReceipts();
            fetchDownloadHistory();
        }
    }, [session, fetchSavedReceipts, fetchDownloadHistory]);

    const handleLogout = async () => {
        await signOut();
        router.push(`/${locale}`);
    };

    const handleDeleteReceipt = (deletedId: string) => {
        setSavedReceipts((prev) => prev.filter((r) => r.id !== deletedId));
    };

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
            {/* Header with User Info */}
            <div className="container mx-auto max-w-4xl px-4 pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            Welcome, {session.user?.name || "User"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {session.user?.email}
                        </p>
                    </div>
                    <Link
                        href={`/${locale}/pricing`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Billing & Pricing
                    </Link>
                </div>

                {/* Credits Section */}
                <div className="mt-6 sm:mt-8">
                    {creditsLoading ? (
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-6 border border-slate-800 dark:border-slate-700">
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                            </div>
                        </div>
                    ) : credits ? (
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-800 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* Balance */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                        <Coins className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-green-400 font-medium">
                                            Credit Balance
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-bold text-white">
                                            {credits.balance}
                                            <span className="text-sm sm:text-base font-normal text-slate-400 ml-1.5">
                                                credits
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Stats & Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                    {/* Stats */}
                                    <div className="flex items-center gap-4 sm:gap-6 text-sm">
                                        <div className="flex items-center gap-1.5 text-green-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>{credits.totalEarned} earned</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-red-400">
                                            <TrendingDown className="w-4 h-4" />
                                            <span>{credits.totalSpent} spent</span>
                                        </div>
                                    </div>

                                    {/* Get More Credits Button */}
                                    <Link href={`/${locale}/pricing`}>
                                        <Button
                                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-md"
                                        >
                                            <Sparkles className="w-4 h-4 mr-1.5" />
                                            Get More Credits
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Subscription Status */}
                            {credits.hasActiveSubscription && credits.subscription && (
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <p className="text-sm text-slate-400">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                            Active Subscription
                                        </span>
                                        <span className="ml-2">
                                            {credits.subscription.planType} - {credits.subscription.creditsPerPeriod} credits/period
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Info */}
                            <p className="mt-4 text-sm text-slate-500">
                                Each download costs {CREDITS_PER_DOWNLOAD} credits. Subscribers get unlimited downloads.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8 sm:py-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    {/* My Saved Templates */}
                    <div className="mb-12 sm:mb-16">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    My Saved Receipts
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Your auto-saved and edited receipts
                                </p>
                            </div>
                            {savedReceipts.length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                    {savedReceipts.length} receipt{savedReceipts.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {isLoadingReceipts ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        ) : savedReceipts.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-10 sm:py-12 text-center">
                                    <BookmarkCheck className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-slate-400 text-sm sm:text-base">
                                        You haven't saved any receipts yet
                                    </p>
                                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                        Receipts are auto-saved when you edit them
                                    </p>
                                    <Link href={`/${locale}/generate`}>
                                        <Button variant="outline" className="mt-4" size="sm">
                                            Create Your First Receipt
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {savedReceipts.map((receipt) => (
                                    <SavedReceiptCard
                                        key={receipt.id}
                                        receipt={receipt}
                                        onDelete={handleDeleteReceipt}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <hr className="border-slate-200 dark:border-slate-700 mb-12 sm:mb-16" />

                    {/* My Download History */}
                    <div className="mb-12 sm:mb-16">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Download History
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Your recent PDF and image downloads
                                </p>
                            </div>
                            {downloadHistory.length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                    {downloadHistory.length} download{downloadHistory.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {isLoadingDownloads ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        ) : downloadHistory.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-10 sm:py-12 text-center">
                                    <Download className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-slate-400 text-sm sm:text-base">
                                        You haven't downloaded any receipts yet
                                    </p>
                                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                        Downloads are tracked when you save as PDF or image
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {downloadHistory.map((download) => (
                                    <DownloadHistoryItem
                                        key={download.id}
                                        download={download}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="text-center space-y-4 sm:space-y-6">
                        <Link href={`/${locale}/templates`}>
                            <Button variant="outline" className="rounded-full px-6 sm:px-8">
                                View All Templates
                            </Button>
                        </Link>

                        <div>
                            <button
                                onClick={handleLogout}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base flex items-center gap-2 mx-auto"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
