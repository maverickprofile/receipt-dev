import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, FileText, Edit3, Download, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { RECEIPT_EXAMPLES, ReceiptExample } from "@/lib/receipt-examples";
import { generateExampleSlug, generateTemplateSlug } from "@/lib/utils";

interface ExamplePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

function findExampleBySlug(slug: string) {
    return RECEIPT_EXAMPLES.find(example => {
        const exampleSlug = generateExampleSlug(example.templateName, example.items, example.total);
        return exampleSlug.toLowerCase() === slug.toLowerCase();
    });
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
        question: "What is MakeReceipt?",
        answer: "MakeReceipt is a free online tool that allows you to create professional-looking receipts for various purposes. It offers customizable templates from popular stores and businesses."
    },
    {
        question: "Is using MakeReceipt legal?",
        answer: "MakeReceipt is designed for legitimate purposes such as expense tracking, record keeping, and business documentation. Users are responsible for ensuring their use complies with applicable laws and regulations."
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
        question: "Can I edit the receipt details?",
        answer: "Absolutely. Every field on the receipt is fully editable - store name, address, items, prices, dates, payment methods, and more."
    },
    {
        question: "What file formats can I export the receipt in?",
        answer: "You can export your receipts as PDF files or PNG images, perfect for printing or digital use."
    },
];

export async function generateMetadata({ params }: ExamplePageProps): Promise<Metadata> {
    const { slug } = await params;
    const example = findExampleBySlug(slug);

    if (!example) {
        return { title: "Example Not Found" };
    }

    const itemsList = example.items.length > 1
        ? `${example.items[0].name} and ${example.items.length - 1} more items`
        : example.items[0].name;

    return {
        title: `${example.templateName} Receipt Example - ${itemsList} | MakeReceipt`,
        description: `View this ${example.templateName} receipt example with ${itemsList} totalling ${example.totalFormatted}. Create your own custom receipt using our free generator.`,
    };
}

export async function generateStaticParams() {
    return RECEIPT_EXAMPLES.map((example) => ({
        slug: generateExampleSlug(example.templateName, example.items, example.total),
    }));
}

export default async function ExamplePage({ params }: ExamplePageProps) {
    const { locale, slug } = await params;
    const example = findExampleBySlug(slug);

    if (!example) {
        notFound();
    }

    const templateSlug = generateTemplateSlug(example.templateName);
    const itemsList = example.items.length > 1
        ? `${example.items[0].name} and ${example.items.length - 1} more items`
        : example.items[0].name;

    return (
        <main className="bg-white dark:bg-slate-900">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 pt-6">
                <Link
                    href={`/${locale}/examples`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Examples
                </Link>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Text content */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                            {example.templateName} Receipt Example
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                            {example.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            This is an example {example.templateName} receipt with {itemsList} totalling {example.totalFormatted}.
                            Use our free receipt generator to create your own custom receipt like this one.
                        </p>

                        {/* Items Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-white">Items in this receipt:</span>
                            </div>
                            <ul className="space-y-1">
                                {example.items.map((item, index) => (
                                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{example.itemCount} items total</span>
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{example.totalFormatted}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link href={`/${locale}/generate/${templateSlug}`}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 h-auto text-base font-medium">
                                    Create Similar Receipt
                                </Button>
                            </Link>
                            <Link href={`/${locale}/template/${templateSlug}`}>
                                <Button variant="outline" className="px-6 py-3 h-auto text-base font-medium border-gray-300 dark:border-gray-600">
                                    View {example.templateName} Template
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Receipt preview with features */}
                    <div className="flex gap-8 items-start justify-center">
                        {/* Receipt preview - Using actual template thumbnail */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                            <div className="w-64 h-80 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                                {example.image ? (
                                    <Image
                                        src={example.image}
                                        alt={`${example.templateName} receipt preview`}
                                        width={256}
                                        height={320}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center">
                                        <FileText className="w-16 h-16 mx-auto mb-2" />
                                        <p>Receipt Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features checklist */}
                        <div className="space-y-3 hidden md:block">
                            {HERO_FEATURES.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Guide Section */}
            <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="text-center mb-12">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Guide</span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        How to create a similar receipt?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                        With our receipt maker create any bill as easy as 1, 2, 3.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            1. Choose the {example.templateName} template
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Select the {example.templateName} template from our collection.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Edit3 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            2. Add your information
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Easily edit all information including line items, prices, payment info, etc.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Download className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            3. Export it for use
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            One click export to use it in your email or print it out.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Frequently asked questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                        Everything you need to know about creating receipts.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {FAQ_ITEMS.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-gray-200 dark:border-gray-700">
                                <AccordionTrigger className="text-left text-gray-900 dark:text-white hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-400">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to create your own receipt?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Start creating professional receipts like this one in just a few clicks.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={`/${locale}/generate/${templateSlug}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto text-base font-medium">
                                Create {example.templateName} Receipt
                            </Button>
                        </Link>
                        <Link href={`/${locale}/examples`}>
                            <Button variant="outline" className="px-8 py-3 h-auto text-base font-medium border-gray-300 dark:border-gray-600">
                                View More Examples
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
