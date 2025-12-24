import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import type { TemplateIndex } from "@/lib/receipt-schemas";
import TemplatesGrid from "@/app/components/templates/TemplatesGrid";

export const metadata: Metadata = {
    title: "Receipt Templates | MakeReceipt",
    description:
        "Choose from a variety of receipt templates including Walmart, Target, CVS, luxury brands, and more. Create professional receipts in minutes.",
};

function getTemplates(): TemplateIndex {
    try {
        const filePath = path.join(
            process.cwd(),
            "public/assets/data/receipt-templates/index.json"
        );
        const fileContents = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Failed to load templates:", error);
        return { templates: [] };
    }
}

interface TemplatesPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
    const { locale } = await params;
    const { templates } = getTemplates();

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-white dark:bg-slate-900 py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 text-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        Features
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-3 sm:mb-4">
                        Choose a template to generate your receipt
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
                        From restaurants and supermarkets to fashion or pharmacy receipts, we&apos;ve got it all!
                    </p>
                </div>
            </section>

            {/* Templates Grid Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-6 sm:py-8">
                <TemplatesGrid templates={templates} locale={locale} />
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 dark:bg-blue-700">
                <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                        Can&apos;t find what you need?
                    </h2>
                    <p className="text-sm sm:text-base text-blue-100 mb-4 sm:mb-6 max-w-xl mx-auto">
                        Request a custom template and we&apos;ll add it to our collection.
                    </p>
                    <Link href={`/${locale}/suggest`}>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50"
                        >
                            Suggest a Template
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
