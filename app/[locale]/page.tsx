// Components
import { ReceiptMain } from "@/app/components";
import { ReceiptContextProvider } from "@/contexts/ReceiptContext";

export default function Home() {
    return (
        <main className="py-10 lg:container">
            <ReceiptContextProvider templateId="home-default">
                <ReceiptMain />
            </ReceiptContextProvider>
        </main>
    );
}
