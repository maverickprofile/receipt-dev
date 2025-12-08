import { Metadata } from "next";
import { ReceiptContextProvider } from "@/contexts/ReceiptContext";
import ReceiptMain from "@/app/components/receipt/ReceiptMain";

interface ReceiptGeneratePageProps {
  params: Promise<{
    locale: string;
    template: string;
  }>;
}

export async function generateMetadata({ params }: ReceiptGeneratePageProps): Promise<Metadata> {
  const { template } = await params;
  const templateName = template.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${templateName} Receipt | Invoify`,
    description: `Generate a ${templateName} receipt with custom details`,
  };
}

export default async function ReceiptGeneratePage({ params }: ReceiptGeneratePageProps) {
  const { template } = await params;

  return (
    <ReceiptContextProvider templateId={template}>
      <ReceiptMain />
    </ReceiptContextProvider>
  );
}

