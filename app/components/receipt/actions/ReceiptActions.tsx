"use client";

import { Download, Printer, RotateCcw, Save, FileJson, Upload, ExternalLink } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useReceiptContext } from "@/contexts/ReceiptContext";

export default function ReceiptActions() {
  const {
    receiptPdf,
    receiptPdfLoading,
    generatePdf,
    downloadPdf,
    printPdf,
    previewPdfInTab,
    resetToTemplate,
    saveReceipt,
    exportReceiptAsJson,
    importReceipt,
  } = useReceiptContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasPdf = receiptPdf && receiptPdf.size > 0;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importReceipt(file);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Generate PDF Button */}
      <Button
        onClick={generatePdf}
        disabled={receiptPdfLoading}
        className="w-full"
        size="lg"
      >
        {receiptPdfLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Generating...
          </>
        ) : hasPdf ? (
          "Regenerate PDF"
        ) : (
          "Generate PDF"
        )}
      </Button>

      {/* PDF Actions (only show when PDF is generated) */}
      {hasPdf && (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={downloadPdf} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={printPdf} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={previewPdfInTab} variant="outline" className="col-span-2">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      )}

      {/* Divider */}
      <div className="border-t my-4" />

      {/* Other Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={saveReceipt} variant="outline" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={resetToTemplate} variant="outline" className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={exportReceiptAsJson} variant="outline" className="flex-1">
          <FileJson className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={handleImportClick} variant="outline" className="flex-1">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

