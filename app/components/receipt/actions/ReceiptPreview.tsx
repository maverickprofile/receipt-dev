"use client";

import { useState, useEffect } from "react";
import { useReceiptContext } from "@/contexts/ReceiptContext";
import { ReceiptTemplate } from "@/app/components/templates/receipt/ReceiptTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebouncedCallback } from "use-debounce";

export default function ReceiptPreview() {
  const { receipt, pdfUrl, receiptPdf, isLoading } = useReceiptContext();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Debounced preview generation
  const generatePreview = useDebouncedCallback(async () => {
    const node = document.getElementById("receipt-preview-node");
    if (node) {
      try {
        setIsGenerating(true);
        // Dynamically import to avoid SSR issues
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(node, {
          quality: 0.95,
          pixelRatio: 1.5, // Reduced from 2 to avoid memory issues
          backgroundColor: "#ffffff",
          skipAutoScale: true, // Prevent scaling artifacts
          cacheBust: true, // Ensure fresh images
        });
        setPreviewImage(dataUrl);
      } catch (e) {
        console.error("Preview generation failed", e);
      } finally {
        setIsGenerating(false);
      }
    }
  }, 500);

  useEffect(() => {
    if (receipt) {
      generatePreview();
    }
  }, [receipt, generatePreview]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 bg-sky-100 dark:bg-gray-900 rounded-lg">
          <div className="animate-pulse bg-muted rounded h-64 sm:h-96 lg:h-[500px]" />
        </CardContent>
      </Card>
    );
  }

  // If we have a finalized Generated PDF/Image (from Create button), show that
  if (pdfUrl && receiptPdf.size > 0) {
    const isImage = receiptPdf.type.startsWith("image/");
    return (
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Generated {isImage ? "Image" : "PDF"}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 lg:p-6 flex justify-center bg-sky-100 dark:bg-gray-900 rounded-b-lg overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-[600px]">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pdfUrl}
              alt="Receipt Preview"
              className="max-w-full h-auto shadow-lg lg:max-h-[550px]"
            />
          ) : (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full min-h-[350px] sm:min-h-[500px] lg:min-h-[600px] border-0"
              title="Receipt PDF Preview"
            />
          )}
        </CardContent>
      </Card>
    );
  }

  if (!receipt) {
    return (
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-10 sm:py-16 lg:py-32 text-sm bg-sky-100 dark:bg-gray-900 rounded-lg min-h-[280px] sm:min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
          No receipt data to preview
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          Live Preview
          {isGenerating && <span className="text-[10px] sm:text-xs font-normal text-muted-foreground">(Updating...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center bg-sky-100 dark:bg-gray-900 rounded-lg p-2 sm:p-4 lg:p-6 min-h-[280px] sm:min-h-[400px] lg:min-h-[600px]">
        {/* Visible Generated Image Preview */}
        {previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage}
            alt="Live Receipt Preview"
            className="max-w-full h-auto shadow-lg transition-opacity duration-300 lg:max-h-[600px] lg:scale-110 origin-top"
            style={{ opacity: isGenerating ? 0.7 : 1 }}
          />
        ) : (
          <div className="animate-pulse bg-muted rounded w-full h-64 sm:h-96 lg:h-[500px]" />
        )}

        {/* Hidden Source Node for Capture */}
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            opacity: 0,
            pointerEvents: "none"
          }}
        >
          <div id="receipt-preview-node" className="bg-white">
            <ReceiptTemplate receipt={receipt} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

