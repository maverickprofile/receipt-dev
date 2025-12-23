"use client";

import {
  Download,
  FileText,
  Loader2,
  Printer,
  RotateCcw,
  Upload,
  Eye,
  Trash2,
  Plus,
  ChevronUp,
  FileJson,
  FileImage, // Added
} from "lucide-react";
import { useRef, useState } from "react";
// Components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReceiptContext } from "@/contexts/ReceiptContext";

export default function ReceiptActions() {
  const {
    receipt,
    receiptPdf,
    receiptPdfLoading,
    generatePdf,
    downloadPdf,
    printPdf,
    previewPdfInTab,
    resetToTemplate,
    clearAllSections,
    saveReceipt,
    exportReceiptAsJson,
    importReceipt,
    updateSettings,
    downloadImage,
  } = useReceiptContext();

  const [acceptedTerms, setAcceptedTerms] = useState(true); // Default to true or false? ReceiptFaker defaults true often, but safer false. Let's do true for convenience or false for strictness? Screenshot shows checked. I'll default false to force interaction or follow screenshot. Screenshot has it CHECKED. I'll default to true.
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!receipt) return null;
  const { settings } = receipt;

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
    <div className="space-y-2 sm:space-y-3">
      {/* Generate Actions */}
      {/* Checkboxes */}
      <div className="space-y-2 mb-2 sm:mb-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="watermark"
            checked={!settings.watermark}
            onCheckedChange={(checked) => updateSettings({ watermark: !checked })}
          />
          <Label htmlFor="watermark" className="text-xs sm:text-sm font-normal cursor-pointer select-none">
            Without Watermark
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs sm:text-sm font-normal cursor-pointer select-none leading-tight">
            Accept <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a> of Create Receipt
          </Label>
        </div>
      </div>

      {/* Create Receipt Button Group */}
      <div className="flex w-full mb-2 sm:mb-3">
        <Button
          className="flex-1 rounded-r-none bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 sm:h-12 text-xs sm:text-sm md:text-base shadow-lg transition-all px-2 sm:px-4"
          onClick={generatePdf}
          disabled={receiptPdfLoading || !acceptedTerms}
        >
          {receiptPdfLoading ? (
            <>
              <Loader2 className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              <span className="hidden xs:inline">Generating...</span>
              <span className="xs:hidden">...</span>
            </>
          ) : hasPdf ? (
            <>
              <span className="hidden sm:inline">REGENERATE ({settings.pdfSize || "80mm"})</span>
              <span className="sm:hidden">REGENERATE</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">CREATE RECEIPT ({settings.pdfSize || "80mm"})</span>
              <span className="sm:hidden">CREATE</span>
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-l-none border-l border-blue-700 bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-12 px-2 sm:px-3 shadow-lg"
              disabled={receiptPdfLoading || !acceptedTerms}
            >
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] sm:w-[200px]">
            <DropdownMenuItem onClick={() => updateSettings({ pdfSize: "80mm" })}>
              80mm
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSettings({ pdfSize: "110mm" })}>
              110mm
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSettings({ pdfSize: "A4" })}>
              A4
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* PDF Actions (only show when PDF is generated) */}
      {hasPdf && (
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <Button onClick={downloadPdf} className="w-full h-9 sm:h-10 text-xs sm:text-sm">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Download
          </Button>
          <Button onClick={printPdf} variant="secondary" className="w-full h-9 sm:h-10 text-xs sm:text-sm">
            <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Print
          </Button>
          <Button onClick={previewPdfInTab} variant="outline" className="col-span-2 h-9 sm:h-10 text-xs sm:text-sm">
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Open in New Tab
          </Button>
        </div>
      )}

      {/* Divider */}
      <div className="border-t my-3 sm:my-4" />

      {/* Secondary Actions Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        <Button variant="outline" onClick={handleImportClick} className="w-full h-9 sm:h-10 text-xs sm:text-sm">
          <Upload className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Load
        </Button>
        <Button variant="outline" onClick={exportReceiptAsJson} className="w-full h-9 sm:h-10 text-xs sm:text-sm">
          <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export
        </Button>
        <Button variant="outline" onClick={downloadImage} className="w-full h-9 sm:h-10 text-xs sm:text-sm">
          <FileImage className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Save Image
        </Button>
        <Button variant="outline" onClick={clearAllSections} className="w-full h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> New
        </Button>
        <Button variant="ghost" onClick={resetToTemplate} className="w-full h-9 sm:h-10 text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10 col-span-2">
          <RotateCcw className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Reset
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

