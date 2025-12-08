"use client";

import { useReceiptContext } from "@/contexts/ReceiptContext";
import { ReceiptTemplate } from "@/app/components/templates/receipt/ReceiptTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReceiptPreview() {
  const { receipt, pdfUrl, receiptPdf, isLoading } = useReceiptContext();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted rounded h-96" />
        </CardContent>
      </Card>
    );
  }

  // If we have a generated PDF, show it in iframe
  if (pdfUrl && receiptPdf.size > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generated PDF</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src={pdfUrl}
            className="w-full min-h-[600px] border-0"
            title="Receipt PDF Preview"
          />
        </CardContent>
      </Card>
    );
  }

  // Otherwise, show live preview
  if (!receipt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-16">
          No receipt data to preview
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
        <div className="bg-white shadow-lg rounded">
          <ReceiptTemplate receipt={receipt} />
        </div>
      </CardContent>
    </Card>
  );
}

