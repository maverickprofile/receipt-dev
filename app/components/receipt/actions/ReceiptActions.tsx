"use client";

import {
  Download,
  Loader2,
  RotateCcw,
  LogIn,
  Lock,
  Sparkles,
  Save,
  Upload,
  FileImage,
  FileText,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useReceiptContext } from "@/contexts/ReceiptContext";
import OutOfCreditsModal from "@/app/components/modals/credits/OutOfCreditsModal";
import { useCredits } from "@/hooks/useCredits";

export default function ReceiptActions() {
  const {
    receipt,
    receiptPdfLoading,
    generatePdf,
    resetToTemplate,
    clearAllSections,
    saveReceipt,
    exportReceiptAsJson,
    importReceipt,
    updateSettings,
    downloadImage,
  } = useReceiptContext();

  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';

  // Get subscription status for watermark lock
  const { credits } = useCredits();
  const hasActiveSubscription = credits?.hasActiveSubscription ?? false;

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [creditsModalData, setCreditsModalData] = useState<{ currentBalance: number; required: number }>({
    currentBalance: 0,
    required: 5,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for auth-required event from ReceiptContext
  useEffect(() => {
    const handleAuthRequired = () => {
      setShowAuthDialog(true);
    };

    window.addEventListener('auth-required-for-download', handleAuthRequired);
    return () => {
      window.removeEventListener('auth-required-for-download', handleAuthRequired);
    };
  }, []);

  // Listen for credits-exhausted event from ReceiptContext
  useEffect(() => {
    const handleCreditsExhausted = (event: CustomEvent<{ currentBalance: number; required: number }>) => {
      setCreditsModalData({
        currentBalance: event.detail?.currentBalance ?? 0,
        required: event.detail?.required ?? 5,
      });
      setShowCreditsModal(true);
    };

    window.addEventListener('credits-exhausted', handleCreditsExhausted as EventListener);
    return () => {
      window.removeEventListener('credits-exhausted', handleCreditsExhausted as EventListener);
    };
  }, []);

  // Force watermark ON for free users (prevent bypassing)
  useEffect(() => {
    if (!hasActiveSubscription && receipt?.settings && !receipt.settings.watermark) {
      updateSettings({ watermark: true });
    }
  }, [hasActiveSubscription, receipt?.settings, updateSettings]);

  const handleSignIn = () => {
    setShowAuthDialog(false);
    router.push(`/${locale}/sign-in`);
  };

  const handleSignUp = () => {
    setShowAuthDialog(false);
    router.push(`/${locale}/sign-up`);
  };

  const handleRemoveWatermark = () => {
    if (hasActiveSubscription) {
      updateSettings({ watermark: false });
    } else {
      router.push(`/${locale}/pricing`);
    }
  };

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

  if (!receipt) return null;
  const { settings } = receipt;

  const templateName = receipt.name || "Receipt";

  return (
    <div className="space-y-3">
      {/* Row 1: Title & Save Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {templateName}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={saveReceipt}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        >
          <Save className="h-3.5 w-3.5 mr-1.5" />
          <span className="hidden sm:inline">Save as new template</span>
          <span className="sm:hidden">Save</span>
        </Button>
      </div>

      {/* Row 2: Reset | Remove Watermark | Download */}
      <div className="flex items-center justify-between gap-2">
        {/* Reset Button - Left */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetToTemplate}
          className="h-8 sm:h-9 text-xs sm:text-sm text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Remove Watermark Button */}
          <Button
            size="sm"
            onClick={handleRemoveWatermark}
            disabled={!settings.watermark && hasActiveSubscription}
            className={`h-8 sm:h-9 text-xs sm:text-sm ${
              settings.watermark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {!hasActiveSubscription ? (
              <>
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Remove watermark</span>
                <span className="sm:hidden">Watermark</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">{settings.watermark ? "Remove watermark" : "No watermark"}</span>
                <span className="sm:hidden">{settings.watermark ? "Remove" : "None"}</span>
              </>
            )}
          </Button>

          {/* Download Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                disabled={receiptPdfLoading}
                className="h-8 sm:h-9 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                {receiptPdfLoading ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                )}
                Download
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Download as PDF</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { updateSettings({ pdfSize: "80mm" }); generatePdf(); }}>
                <FileText className="h-4 w-4 mr-2" />
                PDF - 80mm
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { updateSettings({ pdfSize: "110mm" }); generatePdf(); }}>
                <FileText className="h-4 w-4 mr-2" />
                PDF - 110mm
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { updateSettings({ pdfSize: "A4" }); generatePdf(); }}>
                <FileText className="h-4 w-4 mr-2" />
                PDF - A4
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Download as Image</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { updateSettings({ pdfSize: "80mm" }); setTimeout(() => downloadImage(), 100); }}>
                <FileImage className="h-4 w-4 mr-2" />
                PNG - 80mm
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { updateSettings({ pdfSize: "110mm" }); setTimeout(() => downloadImage(), 100); }}>
                <FileImage className="h-4 w-4 mr-2" />
                PNG - 110mm
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { updateSettings({ pdfSize: "A4" }); setTimeout(() => downloadImage(), 100); }}>
                <FileImage className="h-4 w-4 mr-2" />
                PNG - A4
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 3: Secondary Actions */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImportClick}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Load
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportReceiptAsJson}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllSections}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          New
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

      {/* Auth Required Dialog */}
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              To download receipts, please sign in or create a free account. This helps us provide you with a better experience and save your receipts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="sm:w-auto">Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={handleSignUp} className="sm:w-auto">
              Create Account
            </Button>
            <AlertDialogAction onClick={handleSignIn} className="bg-blue-600 hover:bg-blue-700 sm:w-auto">
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Out of Credits Modal */}
      <OutOfCreditsModal
        open={showCreditsModal}
        onOpenChange={setShowCreditsModal}
        currentBalance={creditsModalData.currentBalance}
        required={creditsModalData.required}
      />
    </div>
  );
}
