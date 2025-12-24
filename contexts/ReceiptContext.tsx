"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

// Hooks
import useToasts from "@/hooks/useToasts";
import { useSession } from "@/lib/auth-client";

// Variables
import {
  GENERATE_RECEIPT_PDF_API,
  LOCAL_STORAGE_RECEIPT_DRAFT_KEY,
  LOCAL_STORAGE_SAVED_RECEIPTS_KEY,
  RECEIPT_TEMPLATES_PATH,
} from "@/lib/variables";

// Types & Schemas
import {
  ReceiptType,
  ReceiptSection,
  SettingsSection,
  SectionType,
  DEFAULT_SETTINGS,
  DEFAULT_HEADER_SECTION,
  DEFAULT_DATETIME_SECTION,
  DEFAULT_CUSTOM_MESSAGE_SECTION,
  DEFAULT_TWO_COLUMN_SECTION,
  DEFAULT_ITEMS_LIST_SECTION,
  DEFAULT_PAYMENT_SECTION,
  DEFAULT_BARCODE_SECTION,
  createSection,
} from "@/lib/receipt-schemas";

// =============================================================================
// Context Types
// =============================================================================

interface ReceiptContextType {
  // State
  receipt: ReceiptType | null;
  receiptPdf: Blob;
  receiptPdfLoading: boolean;
  savedReceipts: ReceiptType[];
  pdfUrl: string | null;
  isLoading: boolean;

  // Sync State (for authenticated users)
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  isAuthenticated: boolean;

  // Template Operations
  loadTemplate: (templateId: string) => Promise<void>;
  resetToTemplate: () => Promise<void>;
  clearAllSections: () => void;

  // Settings Operations
  updateSettings: (settings: Partial<SettingsSection>) => void;

  // Section Operations
  addSection: (type: SectionType, index?: number) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<ReceiptSection>) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  duplicateSection: (sectionId: string) => void;

  // PDF Operations
  generatePdf: () => Promise<void>;
  downloadPdf: () => void;
  printPdf: () => void;
  previewPdfInTab: () => void;
  removeFinalPdf: () => void;
  downloadImage: () => Promise<void>;

  // Save/Load Operations
  saveReceipt: () => void;
  deleteReceipt: (index: number) => void;
  loadReceipt: (receipt: ReceiptType) => void;
  exportReceiptAsJson: () => void;
  importReceipt: (file: File) => void;
}

const defaultReceiptContext: ReceiptContextType = {
  receipt: null,
  receiptPdf: new Blob(),
  receiptPdfLoading: false,
  savedReceipts: [],
  pdfUrl: null,
  isLoading: true,

  isSyncing: false,
  lastSyncedAt: null,
  isAuthenticated: false,

  loadTemplate: async () => { },
  resetToTemplate: async () => { },
  clearAllSections: () => { },

  updateSettings: () => { },

  addSection: () => { },
  removeSection: () => { },
  updateSection: () => { },
  reorderSections: () => { },
  duplicateSection: () => { },

  generatePdf: async () => { },
  downloadPdf: () => { },
  printPdf: () => { },
  previewPdfInTab: () => { },
  removeFinalPdf: () => { },
  downloadImage: async () => { },

  saveReceipt: () => { },
  deleteReceipt: () => { },
  loadReceipt: () => { },
  exportReceiptAsJson: () => { },
  importReceipt: () => { },
};

export const ReceiptContext = createContext<ReceiptContextType>(defaultReceiptContext);

export const useReceiptContext = () => {
  return useContext(ReceiptContext);
};

// =============================================================================
// Provider Props
// =============================================================================

interface ReceiptContextProviderProps {
  children: React.ReactNode;
  templateId?: string;
}

// =============================================================================
// Helper to get default section by type
// =============================================================================

const getDefaultSectionByType = (type: SectionType): Omit<ReceiptSection, "id"> => {
  switch (type) {
    case "header":
      return DEFAULT_HEADER_SECTION;
    case "datetime":
      return DEFAULT_DATETIME_SECTION;
    case "custom_message":
      return DEFAULT_CUSTOM_MESSAGE_SECTION;
    case "two_column":
      return DEFAULT_TWO_COLUMN_SECTION;
    case "items_list":
      return DEFAULT_ITEMS_LIST_SECTION;
    case "payment":
      return DEFAULT_PAYMENT_SECTION;
    case "barcode":
      return DEFAULT_BARCODE_SECTION;
    default:
      return DEFAULT_CUSTOM_MESSAGE_SECTION;
  }
};

// =============================================================================
// Provider Component
// =============================================================================

export const ReceiptContextProvider = ({
  children,
  templateId,
}: ReceiptContextProviderProps) => {
  // Toasts
  const { newInvoiceSuccess, pdfGenerationSuccess, saveInvoiceSuccess, importInvoiceError } =
    useToasts();

  // Auth - detect if user is logged in
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user?.id;

  // State
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<ReceiptType | null>(null);
  const [receiptPdf, setReceiptPdf] = useState<Blob>(new Blob());
  const [receiptPdfLoading, setReceiptPdfLoading] = useState<boolean>(false);
  const [savedReceipts, setSavedReceipts] = useState<ReceiptType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync State (for authenticated users)
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved receipts from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReceiptsJSON = window.localStorage.getItem(LOCAL_STORAGE_SAVED_RECEIPTS_KEY);
      if (savedReceiptsJSON) {
        try {
          setSavedReceipts(JSON.parse(savedReceiptsJSON));
        } catch (e) {
          console.error("Error loading saved receipts:", e);
        }
      }
    }
  }, []);

  // Persist receipt draft to localStorage
  useEffect(() => {
    if (typeof window === "undefined" || !receipt) return;

    try {
      window.localStorage.setItem(LOCAL_STORAGE_RECEIPT_DRAFT_KEY, JSON.stringify(receipt));
    } catch (e) {
      console.error("Error saving receipt draft:", e);
    }
  }, [receipt]);

  // Auto-save to database for authenticated users (debounced)
  useEffect(() => {
    if (!isAuthenticated || !receipt) return;

    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce: Wait 2 seconds before saving to database
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSyncing(true);
        const response = await fetch('/api/user-receipts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: receipt.id,
            name: receipt.name,
            templateId: receipt.id,
            receiptData: receipt,
          }),
        });

        if (response.ok) {
          setLastSyncedAt(new Date());
        }
      } catch (error) {
        console.error("Error syncing receipt to database:", error);
      } finally {
        setIsSyncing(false);
      }
    }, 2000);

    // Cleanup timeout on unmount or receipt change
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [receipt, isAuthenticated]);

  // Load template on mount or when templateId changes
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  // PDF URL from blob
  const pdfUrl = useMemo(() => {
    if (receiptPdf.size > 0) {
      return window.URL.createObjectURL(receiptPdf);
    }
    return null;
  }, [receiptPdf]);

  // =============================================================================
  // Template Operations
  // =============================================================================

  const loadTemplate = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // First check localStorage for a draft
      if (typeof window !== "undefined") {
        const draftJSON = window.localStorage.getItem(LOCAL_STORAGE_RECEIPT_DRAFT_KEY);
        if (draftJSON) {
          const draft = JSON.parse(draftJSON);
          if (draft.id === id) {
            // Check if this is a "bad draft" (fallback) that stuck around
            // If the draft is named "New Receipt" but we are loading a specific template (not default), ignore it.
            if (draft.name === "New Receipt" && id !== "home-default") {
              console.warn("Ignoring cached fallback draft for", id);
              // Fall through to fetch
            } else {
              setReceipt(draft);
              // Still load original template for reset functionality
              const response = await fetch(`${RECEIPT_TEMPLATES_PATH}/${id}.json`);
              if (response.ok) {
                const templateData = await response.json();
                setOriginalTemplate(templateData);
              }
              setIsLoading(false);
              return;
            }
          }
        }
      }

      // Load from template file
      const response = await fetch(`${RECEIPT_TEMPLATES_PATH}/${id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${id}`);
      }
      const templateData: ReceiptType = await response.json();
      setReceipt(templateData);
      setOriginalTemplate(templateData);
    } catch (error) {
      console.error("Error loading template:", error);

      // Check if we have a hardcoded fallback for this ID
      // This ensures critical templates work even if fetch/network fails
      const fallback = (await import("@/lib/fallback-templates")).FALLBACK_TEMPLATES[id];

      if (fallback) {
        console.log("Using fallback template for:", id);
        setReceipt(fallback);
        setOriginalTemplate(fallback);
      } else {
        // Create a minimal default receipt if no fallback exists
        const defaultReceipt: ReceiptType = {
          id,
          name: "New Receipt",
          settings: DEFAULT_SETTINGS,
          sections: [],
        };
        setReceipt(defaultReceipt);
        setOriginalTemplate(defaultReceipt);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetToTemplate = useCallback(async () => {
    let templateToRestore = originalTemplate;

    // If originalTemplate is missing (e.g. valid draft loaded but fetch failed or skipped), try to fetch it again
    if (!templateToRestore && receipt?.id) {
      try {
        const response = await fetch(`${RECEIPT_TEMPLATES_PATH}/${receipt.id}.json`);
        if (response.ok) {
          const data = await response.json();
          templateToRestore = data;
          setOriginalTemplate(data);
        }
      } catch (error) {
        console.error("Error fetching original template for reset:", error);
      }
    }

    if (templateToRestore) {
      // Clear draft from storage explicitly before state update
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_STORAGE_RECEIPT_DRAFT_KEY);
      }

      setReceipt(JSON.parse(JSON.stringify(templateToRestore)));
      setReceiptPdf(new Blob());
      newInvoiceSuccess();
    } else {
      console.warn("Could not reset: No original template found.");
    }
  }, [originalTemplate, receipt, newInvoiceSuccess]);

  // =============================================================================
  // Settings Operations
  // =============================================================================

  const updateSettings = useCallback((updates: Partial<SettingsSection>) => {
    setReceipt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          ...updates,
        },
      };
    });
  }, []);

  // =============================================================================
  // Section Operations
  // =============================================================================

  const addSection = useCallback((type: SectionType, index?: number) => {
    setReceipt((prev) => {
      if (!prev) return prev;
      const defaultSection = getDefaultSectionByType(type);
      const newSection = createSection(defaultSection);
      const newSections = [...prev.sections];

      if (index !== undefined && index >= 0 && index <= newSections.length) {
        newSections.splice(index, 0, newSection as ReceiptSection);
      } else {
        newSections.push(newSection as ReceiptSection);
      }

      return {
        ...prev,
        sections: newSections,
      };
    });
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setReceipt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      };
    });
  }, []);

  // Clear all sections - keeps settings, removes all sections for a fresh start
  const clearAllSections = useCallback(() => {
    setReceipt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        id: "custom",
        name: "Custom Receipt",
        sections: [],
      };
    });
    setReceiptPdf(new Blob());
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<ReceiptSection>) => {
    setReceipt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ) as ReceiptSection[],
      };
    });
  }, []);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    setReceipt((prev) => {
      if (!prev) return prev;
      const newSections = [...prev.sections];
      const [removed] = newSections.splice(startIndex, 1);
      newSections.splice(endIndex, 0, removed);
      return {
        ...prev,
        sections: newSections,
      };
    });
  }, []);

  const duplicateSection = useCallback((sectionId: string) => {
    setReceipt((prev) => {
      if (!prev) return prev;
      const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return prev;

      const sectionToDuplicate = prev.sections[sectionIndex];
      const duplicatedSection = {
        ...JSON.parse(JSON.stringify(sectionToDuplicate)),
        id: `${sectionToDuplicate.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const newSections = [...prev.sections];
      newSections.splice(sectionIndex + 1, 0, duplicatedSection);

      return {
        ...prev,
        sections: newSections,
      };
    });
  }, []);

  // =============================================================================
  // PDF Operations
  // =============================================================================

  // PDF Operations (Now utilizing html-to-image for client-side generation)
  // =============================================================================

  const generatePdf = useCallback(async () => {
    // Require authentication to generate PDF
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('auth-required-for-download'));
      return;
    }

    if (!receipt) return;

    setReceiptPdfLoading(true);
    try {
      // 1. Generate Image from DOM
      // Dynamically import toPng to avoid SSR issues
      const { toPng } = await import("html-to-image");
      // Dynamically import jsPDF
      const { jsPDF } = await import("jspdf");

      const node = document.getElementById("receipt-preview-node");
      if (!node) {
        throw new Error("Receipt preview node not found");
      }

      // Generate PNG data URL
      // Use higher pixel ratio for better clarity in PDF
      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 3, // High resolution for PDF
        backgroundColor: "#ffffff", // Ensure background is white if transparent
      });

      // 2. Create PDF from Image
      // Determine format
      const pdfSize = receipt.settings.pdfSize || "80mm";

      let pdf: any;
      const imgProps = {
        width: node.offsetWidth,
        height: node.offsetHeight,
      };

      // Calculate aspect ratio
      const imgRatio = imgProps.height / imgProps.width;

      if (pdfSize === "A4") {
        // A4 is 210mm x 297mm
        pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        const a4Width = 210;
        // Standard receipts might typically be 80mm wide printed on A4? 
        // But let's assume specific "A4" templates should fill more width or be centered.
        // For simplicity and to match the "Image" preview, we fit it nicely.
        // If the original template was narrow (80mm), printing it 210mm wide might look huge.
        // However, if the user selected "A4" size in settings, the ReceiptTemplate renders with max-width: 794px (~210mm).
        // So the image captured will be A4 proportioned roughly.

        // We fit the image to the A4 width (minus margins)
        const margin = 0; // 0 margin for full bleed or controlled by CSS padding
        const pdfImgWidth = a4Width - (margin * 2);
        const pdfImgHeight = pdfImgWidth * imgRatio;

        pdf.addImage(dataUrl, 'PNG', margin, margin, pdfImgWidth, pdfImgHeight);

      } else {
        // Thermal Receipt (80mm or 110mm)
        // Paper width in mm
        const paperWidth = pdfSize === "110mm" ? 110 : 80;

        // Calculate required height in mm to fit the image
        // If width in PDF is 'paperWidth', then height is paperWidth * imgRatio.
        const contentHeight = paperWidth * imgRatio;

        // Initialize PDF with that exact height so it looks like one long strip (typical for thermal PDFs)
        pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [paperWidth, contentHeight]
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, paperWidth, contentHeight);
      }

      const pdfBlob = pdf.output("blob");
      setReceiptPdf(pdfBlob);

      if (pdfBlob.size > 0) {
        pdfGenerationSuccess();
      }

    } catch (err) {
      console.error("Error generating receipt PDF:", err);
    } finally {
      setReceiptPdfLoading(false);
    }
  }, [receipt, pdfGenerationSuccess, isAuthenticated]);

  // Helper to track downloads for authenticated users
  const trackDownload = useCallback(async (downloadType: 'pdf' | 'image') => {
    if (!isAuthenticated || !receipt) return;

    try {
      await fetch('/api/user-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptId: receipt.id,
          templateId: receipt.id,
          templateName: receipt.name,
          downloadType,
        }),
      });
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  }, [isAuthenticated, receipt]);

  const downloadPdf = useCallback(async () => {
    // Require authentication to download
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('auth-required-for-download'));
      return;
    }

    if (receiptPdf instanceof Blob && receiptPdf.size > 0) {
      const url = window.URL.createObjectURL(receiptPdf);
      const a = document.createElement("a");
      a.href = url;

      // Determine extension
      const extension = receiptPdf.type.startsWith("image/") ? "png" : "pdf";

      a.download = `MakeReceipt-${receipt?.name || "receipt"}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track download for authenticated users
      await trackDownload('pdf');
    }
  }, [receiptPdf, receipt, trackDownload, isAuthenticated]);

  const printPdf = useCallback(() => {
    // Require authentication to print
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('auth-required-for-download'));
      return;
    }

    if (receiptPdf) {
      const pdfUrl = URL.createObjectURL(receiptPdf);

      if (receiptPdf.type.startsWith("image/")) {
        // For images, we need to print the image in a window
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Print Receipt</title></head>
              <body style="margin:0; display:flex; justify-content:center;">
                <img src="${pdfUrl}" style="max-width:100%; height:auto;" onload="window.print();window.close()" />
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      } else {
        // PDF printing
        const printWindow = window.open(pdfUrl, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }
    }
  }, [receiptPdf, isAuthenticated]);

  const previewPdfInTab = useCallback(() => {
    // Require authentication to preview/open in new tab
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('auth-required-for-download'));
      return;
    }

    if (receiptPdf) {
      const url = window.URL.createObjectURL(receiptPdf);
      // For images, browsers handle it fine
      window.open(url, "_blank");
    }
  }, [receiptPdf, isAuthenticated]);

  const downloadImage = useCallback(async () => {
    // Require authentication to download
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('auth-required-for-download'));
      return;
    }

    if (!receipt) return;
    try {
      const { toPng } = await import("html-to-image");
      const node = document.getElementById("receipt-preview-node");
      if (!node) {
        throw new Error("Receipt preview node not found");
      }

      // Generate PNG data URL
      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `MakeReceipt-${receipt.name || "receipt"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Track download for authenticated users
      await trackDownload('image');
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  }, [receipt, trackDownload, isAuthenticated]);

  const removeFinalPdf = useCallback(() => {
    setReceiptPdf(new Blob());
  }, []);

  // =============================================================================
  // Save/Load Operations
  // =============================================================================

  const saveReceipt = useCallback(() => {
    if (!receipt) return;

    const savedReceiptsJSON = localStorage.getItem(LOCAL_STORAGE_SAVED_RECEIPTS_KEY);
    const existingSavedReceipts: ReceiptType[] = savedReceiptsJSON
      ? JSON.parse(savedReceiptsJSON)
      : [];

    const existingIndex = existingSavedReceipts.findIndex((r) => r.id === receipt.id);

    if (existingIndex !== -1) {
      existingSavedReceipts[existingIndex] = receipt;
    } else {
      existingSavedReceipts.push(receipt);
    }

    localStorage.setItem(LOCAL_STORAGE_SAVED_RECEIPTS_KEY, JSON.stringify(existingSavedReceipts));
    setSavedReceipts(existingSavedReceipts);
    saveInvoiceSuccess();
  }, [receipt, saveInvoiceSuccess]);

  const deleteReceipt = useCallback((index: number) => {
    if (index >= 0 && index < savedReceipts.length) {
      const updatedReceipts = [...savedReceipts];
      updatedReceipts.splice(index, 1);
      setSavedReceipts(updatedReceipts);
      localStorage.setItem(LOCAL_STORAGE_SAVED_RECEIPTS_KEY, JSON.stringify(updatedReceipts));
    }
  }, [savedReceipts]);

  const loadReceipt = useCallback((receiptToLoad: ReceiptType) => {
    setReceipt(receiptToLoad);
    // When loading a saved receipt, that loaded state becomes the new baseline "original"
    // So if they make changes and hit reset, it goes back to this loaded state.
    setOriginalTemplate(JSON.parse(JSON.stringify(receiptToLoad)));
    setReceiptPdf(new Blob());
  }, []);

  const exportReceiptAsJson = useCallback(() => {
    if (!receipt) return;

    const dataStr = JSON.stringify(receipt, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MakeReceipt-${receipt.name || "receipt"}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [receipt]);

  const importReceipt = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          setReceipt(importedData);
          // When importing, the imported file is the new baseline "original"
          setOriginalTemplate(JSON.parse(JSON.stringify(importedData)));
          setReceiptPdf(new Blob());
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          importInvoiceError();
        }
      };
      reader.readAsText(file);
    },
    [importInvoiceError]
  );

  // =============================================================================
  // Context Value
  // =============================================================================

  return (
    <ReceiptContext.Provider
      value={{
        receipt,
        receiptPdf,
        receiptPdfLoading,
        savedReceipts,
        pdfUrl,
        isLoading,

        isSyncing,
        lastSyncedAt,
        isAuthenticated,

        loadTemplate,
        resetToTemplate,
        clearAllSections,

        updateSettings,

        addSection,
        removeSection,
        updateSection,
        reorderSections,
        duplicateSection,

        generatePdf,
        downloadPdf,
        printPdf,
        previewPdfInTab,
        removeFinalPdf,
        downloadImage,

        saveReceipt,
        deleteReceipt,
        loadReceipt,
        exportReceiptAsJson,
        importReceipt,
      }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};

