

// ... existing imports ...

// ... (skipping to Barcode render)

const BarcodeSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "barcode") return null;
  // If no value, don't render or render dummy? Schema default is "".
  // React-barcode needs a value.
  const barcodeValue = section.value || "123456789012";

  // Calculate width scale based on section.width (100-300px)
  // react-barcode 'width' prop is bar width (default 2).
  // content is roughly (Length * WidthProp) + margins.
  // We can treat section.width as a rough proxy for 'width' prop? 
  // No, 100px is huge for bar width. 
  // Let's assume section.width controls the 'width' (scale) prop like: 1=thin, 2=normal, 3=wide.
  // Map 100-300 to 1-3?
  // width={(section.width || 150) / 100} approx.
  const barWidth = (section.width || 150) / 100;

  return (
    <div className="flex flex-col items-center gap-2 overflow-hidden w-full">
      <div className="max-w-full text-center">
        {/* Using Libre Barcode 39 Font via CSS variable from Next.js fonts */}
        <div
          style={{
            fontFamily: 'var(--font-libre-barcode-39), "Libre Barcode 39", cursive',
            fontSize: `${(section.height || 50) + 20}px`,
            lineHeight: 1,
            transform: `scaleX(${barWidth})`,
            transformOrigin: "center",
            whiteSpace: "nowrap"
          }}
        >
          {`*${barcodeValue}*`}
        </div>
      </div>
      {section.divider.enabled && renderDivider(section.divider.style)}
    </div>
  );
};
import type { ReceiptType, ReceiptSection, SettingsSection } from "@/lib/receipt-schemas";

// =============================================================================
// Helper Functions
// =============================================================================

const formatCurrency = (
  amount: number,
  currency: string,
  format: SettingsSection["currencyFormat"]
): string => {
  const formattedAmount = amount.toFixed(2);
  switch (format) {
    case "prefix":
      return `${currency}${formattedAmount}`;
    case "suffix":
      return `${formattedAmount}${currency}`;
    case "suffix_space":
      return `${formattedAmount} ${currency}`;
    default:
      return `${currency}${formattedAmount}`;
  }
};

const renderDivider = (style: string): React.ReactNode => {
  const dividerMap: Record<string, string> = {
    "---": "─".repeat(40),
    "===": "═".repeat(40),
    "...": "·".repeat(40),
    ":::": ":".repeat(40),
    "***": "*".repeat(40),
  };

  if (style === "blank") {
    return <div className="h-6 w-full"></div>;
  }

  return <div className="text-center overflow-hidden whitespace-nowrap">{dividerMap[style] || ""}</div>;
};

const getTextAlign = (alignment: string): React.CSSProperties["textAlign"] => {
  return alignment as React.CSSProperties["textAlign"];
};

// =============================================================================
// Section Renderers
// =============================================================================

interface SectionProps {
  section: ReceiptSection;
  settings: SettingsSection;
}

const HeaderSectionRender = ({ section, settings }: SectionProps) => {
  if (section.type !== "header") return null;
  return (
    <div style={{ textAlign: getTextAlign(section.alignment) }}>
      {section.showLogo && section.logoUrl && (section.logoWidth || 0) > 0 && (
        <div className="flex justify-center mb-2">
          <img
            src={section.logoUrl}
            alt="Logo"
            style={{ width: `${section.logoWidth}px`, maxWidth: "200px" }}
          />
        </div>
      )}
      <div className="font-bold text-lg">{section.businessName}</div>
      {section.address && <div className="whitespace-pre-line">{section.address}</div>}
      {/* Phone, Website, ExtraInfo are merged into Address/Details in the form interface, 
          so we don't render them separately to avoid 'ghost' data appearing that the user can't edit. */}
      {/* {section.phone && <div>{section.phone}</div>} */}
      {/* {section.website && <div>{section.website}</div>} */}
      {/* {section.extraInfo && <div className="whitespace-pre-line mt-1">{section.extraInfo}</div>} */}
      {section.divider.enabled && renderDivider(section.divider.style)}
    </div>
  );
};

const DateTimeSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "datetime") return null;
  const date = new Date(section.dateTime);
  const formattedDate = date.toLocaleString();
  return (
    <div style={{ textAlign: getTextAlign(section.alignment) }}>
      <div>{formattedDate}</div>
      {section.divider.enabled && renderDivider(section.divider.style)}
    </div>
  );
};

const CustomMessageSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "custom_message") return null;
  return (
    <div style={{ textAlign: getTextAlign(section.alignment) }}>
      <div className="whitespace-pre-line">{section.message}</div>
      {section.divider.enabled && renderDivider(section.divider.style)}
    </div>
  );
};

const TwoColumnSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "two_column") return null;
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {section.column1.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.key}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        <div>
          {section.column2.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.key}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      {section.divider.enabled && renderDivider(section.divider.style)}
    </div>
  );
};

const ItemsListSectionRender = ({ section, settings }: SectionProps) => {
  if (section.type !== "items_list") return null;

  const getTotalFontSize = () => {
    if (!section.increaseTotalSize?.enabled) return "inherit";
    const percentageMap: Record<string, string> = {
      "+10%": "1.1em",
      "+20%": "1.2em",
      "+50%": "1.5em",
      "+75%": "1.75em",
      "+100%": "2em",
    };
    return percentageMap[section.increaseTotalSize.percentage] || "inherit";
  };

  return (
    <div>
      {/* Items */}
      <div className="space-y-1">
        {section.items.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>
              {item.quantity} x {item.name}
            </span>
            <span>{formatCurrency(item.price * item.quantity, settings.currency, settings.currencyFormat)}</span>
          </div>
        ))}
      </div>

      {section.divider.enabled && renderDivider(section.divider.style)}

      {/* Total Lines */}
      {section.totalLines && section.totalLines.length > 0 && (
        <div className="space-y-1 mt-2">
          {section.totalLines.map((line, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{line.title}</span>
              <span>{formatCurrency(line.value, settings.currency, settings.currencyFormat)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {section.total && (
        <div
          className="flex justify-between font-bold mt-2"
          style={{ fontSize: getTotalFontSize() }}
        >
          <span>{section.total.title}</span>
          <span>{formatCurrency(section.total.value, settings.currency, settings.currencyFormat)}</span>
        </div>
      )}

      {section.bottomDivider?.enabled && renderDivider(section.bottomDivider.style)}
    </div>
  );
};

const PaymentSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "payment") return null;
  const customLines = section.customLines || [];
  return (
    <div>
      <div className="font-semibold mb-2">
        {section.method}
      </div>
      {customLines.length > 0 && (
        <div className="space-y-1">
          {customLines.map((line, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{line.title}</span>
              <span>{line.value}</span>
            </div>
          ))}
        </div>
      )}
      {section.divider?.enabled && renderDivider(section.divider.style)}
    </div>
  );
};



// =============================================================================
// Main Receipt Template Component
// =============================================================================

interface ReceiptTemplateProps {
  receipt: ReceiptType;
}

export function ReceiptTemplate({ receipt }: ReceiptTemplateProps) {
  const { settings, sections } = receipt;

  const fontFamily = {
    font1: "var(--font-roboto-mono)",
    font2: "var(--font-space-mono)",
    font3: "var(--font-inconsolata)",
    hypermarket: '"Hypermarket", sans-serif',
    "ocr-b": '"OCR-B", "Courier New", monospace',
  }[settings.font];

  // Background styles using CSS gradients instead of images
  const getBackgroundStyle = () => {
    if (!settings.showBackground.enabled) return { backgroundColor: "#ffffff" };

    switch (settings.showBackground.style) {
      case "1": // Simple White (Default)
        return { backgroundColor: "#ffffff" };
      case "2": // Crumpled Paper (Simulated with gradients)
        return {
          backgroundColor: "#f4f4f4",
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(0,0,0,0.03) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(0,0,0,0.03) 0%, transparent 20%),
            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 30%),
            linear-gradient(45deg, #fdfbfb 0%, #ebedee 100%)
          `,
        };
      case "3": // Old/Thermal Paper (Yellowish)
        return {
          backgroundColor: "#fffdf0",
          backgroundImage: "linear-gradient(to bottom, #fffdf0 0%, #fdfbf0 100%)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
        };
      case "4": // Blue Tint (Modern)
        return {
          backgroundColor: "#f0f8ff",
          backgroundImage: "linear-gradient(to bottom, #f0f8ff 0%, #e6f2ff 100%)",
        };
      case "5": // High Contrast / Darker
        return {
          backgroundColor: "#e0e0e0",
          backgroundImage: "repeating-linear-gradient(45deg, #e0e0e0 0px, #e0e0e0 10px, #e8e8e8 10px, #e8e8e8 20px)",
        };
      default:
        return { backgroundColor: "#ffffff" };
    }
  };

  // Extract Reference # from Payment Section for Barcode
  const getReferenceNumber = () => {
    const paymentSection = sections.find((s) => s.type === "payment") as import("@/lib/receipt-schemas").PaymentSection | undefined;
    if (paymentSection?.customLines) {
      const refLine = paymentSection.customLines.find(
        (line) => line.title.toLowerCase().includes("reference") || line.title.toLowerCase().includes("ref")
      );
      if (refLine) return refLine.value;
    }
    return "123456789012"; // Fallback
  };

  const renderSection = (section: ReceiptSection) => {
    const props = { section, settings };
    switch (section.type) {
      case "header":
        return <HeaderSectionRender key={section.id} {...props} />;
      case "datetime":
        return <DateTimeSectionRender key={section.id} {...props} />;
      case "custom_message":
        return <CustomMessageSectionRender key={section.id} {...props} />;
      case "two_column":
        return <TwoColumnSectionRender key={section.id} {...props} />;
      case "items_list":
        return <ItemsListSectionRender key={section.id} {...props} />;
      case "payment":
        return <PaymentSectionRender key={section.id} {...props} />;
      case "barcode":
        // Inject dynamic value for barcode if section.value is empty
        const barcodeProps = {
          ...props,
          section: {
            ...section,
            value: section.value || getReferenceNumber(),
          } as import("@/lib/receipt-schemas").BarcodeSection,
        };
        return <BarcodeSectionRender key={section.id} {...barcodeProps} />;
      default:
        return null;
    }
  };

  const getMaxWidth = () => {
    switch (settings.pdfSize) {
      case "A4":
        return "794px";
      case "110mm":
        return "440px";
      case "80mm":
      default:
        return "320px";
    }
  };

  return (
    <div
      className="w-full mx-auto p-4 text-sm transition-all duration-300 ease-in-out shadow-sm relative overflow-hidden"
      style={{
        maxWidth: getMaxWidth(),
        fontFamily,
        color: settings.textColor,
        ...getBackgroundStyle(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: settings.pdfSize === "A4" ? "1123px" : "auto",
      }}
    >
      {/* Watermark Overlay */}
      {settings.watermark && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.20] select-none flex flex-wrap content-center justify-center overflow-hidden z-0"
          style={{ transform: "scale(1.5)" }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="whitespace-nowrap font-bold text-3xl p-6 rotate-[-45deg]"
              style={{ color: "#000" }}
            >
              MakeReceipt
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3 relative z-10">
        {sections.map(renderSection)}
      </div>
    </div>
  );
}

export default ReceiptTemplate;

