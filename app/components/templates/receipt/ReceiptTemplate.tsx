"use client";

import React from "react";
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
    blank: "",
  };
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
      {section.logo.url && section.logo.size > 0 && (
        <div className="flex justify-center mb-2">
          <img
            src={section.logo.url}
            alt="Logo"
            style={{ width: `${section.logo.size}%`, maxWidth: "200px" }}
          />
        </div>
      )}
      <div className="whitespace-pre-line">{section.businessDetails}</div>
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
    if (!section.increaseTotalSize.enabled) return "inherit";
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
      <div className="space-y-1 mt-2">
        {section.totalLines.map((line, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{line.title}</span>
            <span>{formatCurrency(line.value, settings.currency, settings.currencyFormat)}</span>
          </div>
        ))}
      </div>
      
      {/* Total */}
      <div
        className="flex justify-between font-bold mt-2"
        style={{ fontSize: getTotalFontSize() }}
      >
        <span>{section.total.title}</span>
        <span>{formatCurrency(section.total.value, settings.currency, settings.currencyFormat)}</span>
      </div>
      
      {section.bottomDivider.enabled && renderDivider(section.bottomDivider.style)}
    </div>
  );
};

const PaymentSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "payment") return null;
  return (
    <div>
      <div className="font-semibold mb-2">
        {section.paymentType === "cash" ? "CASH" : "CARD"}
      </div>
      <div className="space-y-1">
        {section.lines.map((line, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{line.title}</span>
            <span>{line.value}</span>
          </div>
        ))}
      </div>
      {section.divider.enabled && renderDivider(section.divider.style)}
    </div>
  );
};

const BarcodeSectionRender = ({ section }: SectionProps) => {
  if (section.type !== "barcode") return null;
  return (
    <div className="flex justify-center">
      <div
        style={{
          width: `${section.length}%`,
          height: `${section.size}px`,
          background: `repeating-linear-gradient(
            90deg,
            #000 0px,
            #000 2px,
            #fff 2px,
            #fff 4px
          )`,
        }}
      />
      {section.divider.enabled && renderDivider(section.divider.style)}
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
    font1: "'Roboto Mono', monospace",
    font2: "'Space Mono', monospace",
    font3: "'Inconsolata', monospace",
  }[settings.font];

  const backgroundStyle = settings.showBackground.enabled
    ? `url('/assets/img/receipt-bg-${settings.showBackground.style}.png')`
    : undefined;

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
        return <BarcodeSectionRender key={section.id} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full max-w-[320px] mx-auto p-4 text-sm"
      style={{
        fontFamily,
        color: settings.textColor,
        backgroundImage: backgroundStyle,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="space-y-3">
        {sections.map(renderSection)}
      </div>
    </div>
  );
}

export default ReceiptTemplate;

