import Link from "next/link";
import Image from "next/image";
import { Check, FileText, Edit3, Download, Receipt, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import fs from "fs";
import path from "path";
import type { TemplateIndex } from "@/lib/receipt-schemas";
import { generateTemplateSlug } from "@/lib/utils";

function getTemplates(): TemplateIndex {
    try {
        const filePath = path.join(process.cwd(), "public/assets/data/receipt-templates/index.json");
        const fileContents = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Failed to load templates:", error);
        return { templates: [] };
    }
}

interface HomeProps {
    params: Promise<{
        locale: string;
    }>;
}

const HERO_FEATURES = [
    "Add custom logo",
    "Edit line items",
    "Choose payment method",
    "Add/remove receipt elements",
    "Customize business information",
    "Choose font",
    "Add realistic texture",
];

const FAQ_ITEMS = [
    {
        question: "What is ReceiptMaker?",
        answer: "ReceiptMaker is a free online tool that allows you to create professional-looking receipts for various purposes. It offers customizable templates from popular stores and businesses."
    },
    {
        question: "Is using ReceiptMaker legal?",
        answer: "ReceiptMaker is designed for legitimate purposes such as expense tracking, record keeping, and business documentation. Users are responsible for ensuring their use complies with applicable laws and regulations."
    },
    {
        question: "Why would someone need a receipt generator?",
        answer: "There are many legitimate reasons to use a receipt generator: replacing lost receipts for warranty claims, creating receipts for cash transactions, expense reporting, record keeping, and business documentation."
    },
    {
        question: "How to make a receipt?",
        answer: "Simply choose a template, fill in your information including business details, items, prices, and payment method. Then export your receipt as a PDF or image file."
    },
    {
        question: "What types of receipt templates do you offer?",
        answer: "We offer 30+ templates including retail stores (Target, Walmart, Costco), restaurants, pharmacies (Walgreens, CVS), hotels, gas stations, and many more."
    },
    {
        question: "Can I upload my own business logo?",
        answer: "Yes! You can upload your own logo to customize any receipt template and make it match your business branding."
    },
    {
        question: "Can I edit the receipt details?",
        answer: "Absolutely. Every field on the receipt is fully editable - store name, address, items, prices, dates, payment methods, and more."
    },
    {
        question: "Can I make the receipt look like a real printed one?",
        answer: "Yes, our receipts are designed to look authentic with realistic fonts, thermal paper textures, and proper formatting."
    },
    {
        question: "What file formats can I export the receipt in?",
        answer: "You can export your receipts as PDF files or PNG images, perfect for printing or digital use."
    },
    {
        question: "Do I need to download any software?",
        answer: "No! ReceiptMaker works entirely in your browser. No downloads, installations, or sign-ups required."
    },
    {
        question: "Is there a watermark on the receipts?",
        answer: "Free receipts may include a small watermark. Premium users get watermark-free exports."
    },
    {
        question: "Is ReceiptMaker mobile-friendly?",
        answer: "Yes, our tool is fully responsive and works great on smartphones, tablets, and desktop computers."
    },
    {
        question: "Is ReceiptMaker free to use?",
        answer: "Yes! Basic features are completely free. We also offer premium plans with additional templates and features."
    },
];

export default async function Home({ params }: HomeProps) {
    const { locale } = await params;
    const { templates } = getTemplates();
    const displayTemplates = templates.slice(0, 10);

    return (
        <main className="bg-white dark:bg-slate-900">
            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Text content */}
                    <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                            Free Fake Receipt Generator
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto lg:mx-0">
                            Make receipts with custom information from selected templates in seconds!
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
                            <Link href={`/${locale}/generate`}>
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 h-auto text-sm sm:text-base font-semibold rounded-full w-full sm:w-auto">
                                    Generate Receipt
                                </Button>
                            </Link>
                            <Link href={`/${locale}/templates`}>
                                <Button variant="outline" className="px-6 sm:px-8 py-3 h-auto text-sm sm:text-base font-semibold rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 w-full sm:w-auto">
                                    View All Templates
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Receipt preview with features in blue container */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                            {/* Receipt Image */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                                <Image
                                    src="/assets/img/MakeReceipt-Walgreens Receipt (1).png"
                                    alt="Receipt Preview"
                                    width={260}
                                    height={380}
                                    className="w-[180px] sm:w-[200px] lg:w-[260px] h-auto object-contain"
                                />
                            </div>

                            {/* Features checklist - visible on all screens now */}
                            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                {HERO_FEATURES.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="text-center mb-8 sm:mb-10">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Features</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        Choose a template to generate your receipt
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto px-2">
                        From restaurants and supermarkets to fashion or pharmacy receipts, we&apos;ve got it all!
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                    {displayTemplates.map((template) => {
                        const slug = generateTemplateSlug(template.name);
                        return (
                            <Link
                                key={template.id}
                                href={`/${locale}/template/${slug}`}
                                className="block group"
                            >
                                <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer border-gray-200 dark:border-gray-700">
                                    <CardContent className="p-2 sm:p-4">
                                        <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden mb-2 sm:mb-3 p-1 sm:p-2">
                                            {template.thumbnail ? (
                                                <Image
                                                    src={template.thumbnail}
                                                    alt={template.name}
                                                    width={200}
                                                    height={267}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <Receipt className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-center text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                            {template.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center mt-8 sm:mt-10">
                    <Link href={`/${locale}/templates`}>
                        <Button variant="outline" className="px-6 py-2 border-gray-300 dark:border-gray-600">
                            View All Templates
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Guide Section */}
            <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="text-center mb-8 sm:mb-12">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Guide</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        How to make a fake receipt?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3">
                        With our receipt maker create any bill as easy as 1, 2, 3.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                            1. Choose from 100+ templates
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Choose from lots of different receipt templates or create your own from scratch.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Edit3 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                            2. Add your information
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Easily edit all information including line items, prices, payment info, etc.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Download className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                            3. Export it for use
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            One click export to use it in your email or print it out.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Frequently asked questions
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3">
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {FAQ_ITEMS.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-gray-200 dark:border-gray-700">
                                <AccordionTrigger className="text-left text-sm sm:text-base text-gray-900 dark:text-white hover:no-underline py-3 sm:py-4">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Still Have Questions Section */}
            <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-200 dark:bg-blue-800 border-2 border-white dark:border-gray-800"></div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-200 dark:bg-green-800 border-2 border-white dark:border-gray-800"></div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-200 dark:bg-purple-800 border-2 border-white dark:border-gray-800"></div>
                        </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Still have questions?
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                        Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
                    </p>
                    <Link href={`/${locale}/contact`}>
                        <Button className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">
                            Get in touch
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Get Started Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-10 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left side */}
                        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                Get started in 1 minute
                            </h2>
                            <div className="space-y-3 sm:space-y-4 inline-block text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Choose a template</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Add your information</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Export it for use</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
                                <Link href={`/${locale}/generate`}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto">
                                        Generate Receipt
                                    </Button>
                                </Link>
                                <Link href={`/${locale}/templates`}>
                                    <Button variant="outline" className="border-gray-300 dark:border-gray-600 w-full sm:w-auto">
                                        View Templates
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right side - App screenshot mockup */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-md lg:max-w-none">
                                <Image
                                    src="/assets/img/Generate-Receipt-ReceiptMaker-12-23-2025_10_30_PM.png"
                                    alt="Receipt Generator Interface"
                                    width={600}
                                    height={450}
                                    className="rounded-xl shadow-2xl w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
