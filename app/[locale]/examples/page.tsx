import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExamplesGrid from "@/app/components/examples/ExamplesGrid";
import { RECEIPT_EXAMPLES } from "@/lib/receipt-examples";

export const metadata: Metadata = {
    title: "Receipt Examples | MakeReceipt",
    description:
        "Browse a variety of receipt examples to see different receipt styles and formats. Find inspiration for your receipts.",
};

interface ExamplesPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function ExamplesPage({ params }: ExamplesPageProps) {
    const { locale } = await params;

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-white dark:bg-slate-900 py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        Examples
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
                        Here&apos;s some receipt examples generated with MakeReceipt recently.
                    </p>
                </div>
            </section>

            {/* Examples Grid Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-6 sm:py-8">
                <ExamplesGrid examples={RECEIPT_EXAMPLES} locale={locale} />
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                        Ready to create your own receipt?
                    </h2>
                    <p className="text-sm sm:text-base text-blue-100 mb-4 sm:mb-6 max-w-xl mx-auto">
                        Choose from over 30 templates and start generating professional
                        receipts in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link href={`/${locale}/templates`}>
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                            >
                                Browse Templates
                            </Button>
                        </Link>
                        <Link href={`/${locale}/generate`}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                            >
                                Start Creating
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
