import { Metadata } from "next";
import { ReceiptContextProvider } from "@/contexts/ReceiptContext";
import ReceiptMain from "@/app/components/receipt/ReceiptMain";

export const metadata: Metadata = {
    title: "Generate Receipt | ReceiptMaker",
    description: "Create custom receipts with our free receipt generator. Add items, prices, taxes, payment methods, and more.",
};

export default async function GeneratePage() {
    return (
        <main className="py-4 sm:py-6 lg:py-10 lg:container">
            <ReceiptContextProvider templateId="walgreens">
                <ReceiptMain />
            </ReceiptContextProvider>
        </main>
    );
}
