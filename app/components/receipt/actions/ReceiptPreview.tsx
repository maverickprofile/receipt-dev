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
          pixelRatio: 2,
          backgroundColor: "#ffffff",
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
        <CardHeader>
          <CardTitle className="text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted rounded h-96" />
        </CardContent>
      </Card>
    );
  }

  // If we have a finalized Generated PDF/Image (from Create button), show that
  if (pdfUrl && receiptPdf.size > 0) {
    const isImage = receiptPdf.type.startsWith("image/");
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generated {isImage ? "Image" : "PDF"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center bg-gray-100 dark:bg-gray-900 rounded-b-lg overflow-hidden">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pdfUrl}
              alt="Receipt Preview"
              className="max-w-full h-auto shadow-lg my-4"
              style={{ maxHeight: "800px" }}
            />
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full min-h-[600px] border-0"
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
        <CardTitle className="text-lg flex items-center gap-2">
          Live Preview
          {isGenerating && <span className="text-xs font-normal text-muted-foreground">(Updating...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-4 min-h-[400px]">
        {/* Visible Generated Image Preview */}
        {previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage}
            alt="Live Receipt Preview"
            className="max-w-full h-auto shadow-lg transition-opacity duration-300"
            style={{ opacity: isGenerating ? 0.7 : 1 }}
          />
        ) : (
          <div className="animate-pulse bg-muted rounded w-full h-96" />
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

