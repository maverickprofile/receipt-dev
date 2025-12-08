import { z } from "zod";

// =============================================================================
// Enums & Basic Types
// =============================================================================

export const DividerStyleSchema = z.enum(["---", "===", "...", ":::", "***", "blank"]);
export type DividerStyle = z.infer<typeof DividerStyleSchema>;

export const AlignmentSchema = z.enum(["left", "center", "right"]);
export type Alignment = z.infer<typeof AlignmentSchema>;

export const CurrencyFormatSchema = z.enum(["prefix", "suffix", "suffix_space"]);
export type CurrencyFormat = z.infer<typeof CurrencyFormatSchema>;

export const FontStyleSchema = z.enum(["font1", "font2", "font3"]);
export type FontStyle = z.infer<typeof FontStyleSchema>;

export const BackgroundStyleSchema = z.enum(["1", "2", "3", "4", "5"]);
export type BackgroundStyle = z.infer<typeof BackgroundStyleSchema>;

export const PaymentTypeSchema = z.enum(["cash", "card"]);
export type PaymentType = z.infer<typeof PaymentTypeSchema>;

export const TotalSizePercentageSchema = z.enum(["+10%", "+20%", "+50%", "+75%", "+100%"]);
export type TotalSizePercentage = z.infer<typeof TotalSizePercentageSchema>;

export const SectionTypeSchema = z.enum([
  "header",
  "datetime",
  "custom_message",
  "two_column",
  "items_list",
  "payment",
  "barcode",
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

// =============================================================================
// Divider Config
// =============================================================================

export const DividerConfigSchema = z.object({
  enabled: z.boolean(),
  style: DividerStyleSchema,
});
export type DividerConfig = z.infer<typeof DividerConfigSchema>;

// =============================================================================
// Settings Section
// =============================================================================

export const SettingsSectionSchema = z.object({
  currency: z.string().min(1),
  currencyFormat: CurrencyFormatSchema,
  font: FontStyleSchema,
  textColor: z.string().min(1),
  showBackground: z.object({
    enabled: z.boolean(),
    style: BackgroundStyleSchema,
  }),
});
export type SettingsSection = z.infer<typeof SettingsSectionSchema>;

// =============================================================================
// Section Schemas
// =============================================================================

// Header Section
export const HeaderSectionSchema = z.object({
  id: z.string(),
  type: z.literal("header"),
  alignment: AlignmentSchema,
  logo: z.object({
    url: z.string(),
    size: z.number().min(0).max(100),
  }),
  businessDetails: z.string(),
  divider: DividerConfigSchema,
});
export type HeaderSection = z.infer<typeof HeaderSectionSchema>;

// DateTime Section
export const DateTimeSectionSchema = z.object({
  id: z.string(),
  type: z.literal("datetime"),
  alignment: AlignmentSchema,
  dateTime: z.string(),
  divider: DividerConfigSchema,
});
export type DateTimeSection = z.infer<typeof DateTimeSectionSchema>;

// Custom Message Section
export const CustomMessageSectionSchema = z.object({
  id: z.string(),
  type: z.literal("custom_message"),
  alignment: AlignmentSchema,
  message: z.string(),
  divider: DividerConfigSchema,
});
export type CustomMessageSection = z.infer<typeof CustomMessageSectionSchema>;

// Key-Value Pair for Two Column
export const KeyValuePairSchema = z.object({
  key: z.string(),
  value: z.string(),
});
export type KeyValuePair = z.infer<typeof KeyValuePairSchema>;

// Two Column Section
export const TwoColumnSectionSchema = z.object({
  id: z.string(),
  type: z.literal("two_column"),
  column1: z.array(KeyValuePairSchema),
  column2: z.array(KeyValuePairSchema),
  divider: DividerConfigSchema,
});
export type TwoColumnSection = z.infer<typeof TwoColumnSectionSchema>;

// Receipt Item
export const ReceiptItemSchema = z.object({
  quantity: z.number(),
  name: z.string(),
  price: z.number(),
});
export type ReceiptItem = z.infer<typeof ReceiptItemSchema>;

// Total Line
export const TotalLineSchema = z.object({
  title: z.string(),
  value: z.number(),
});
export type TotalLine = z.infer<typeof TotalLineSchema>;

// Items List Section
export const ItemsListSectionSchema = z.object({
  id: z.string(),
  type: z.literal("items_list"),
  items: z.array(ReceiptItemSchema),
  divider: DividerConfigSchema,
  totalLines: z.array(TotalLineSchema),
  total: TotalLineSchema,
  increaseTotalSize: z.object({
    enabled: z.boolean(),
    percentage: TotalSizePercentageSchema,
  }),
  bottomDivider: DividerConfigSchema,
});
export type ItemsListSection = z.infer<typeof ItemsListSectionSchema>;

// Payment Line
export const PaymentLineSchema = z.object({
  title: z.string(),
  value: z.string(),
});
export type PaymentLine = z.infer<typeof PaymentLineSchema>;

// Payment Section
export const PaymentSectionSchema = z.object({
  id: z.string(),
  type: z.literal("payment"),
  paymentType: PaymentTypeSchema,
  lines: z.array(PaymentLineSchema),
  divider: DividerConfigSchema,
});
export type PaymentSection = z.infer<typeof PaymentSectionSchema>;

// Barcode Section
export const BarcodeSectionSchema = z.object({
  id: z.string(),
  type: z.literal("barcode"),
  size: z.number().min(20).max(100),
  length: z.number().min(50).max(100),
  divider: DividerConfigSchema,
});
export type BarcodeSection = z.infer<typeof BarcodeSectionSchema>;

// =============================================================================
// Union of All Sections
// =============================================================================

export const ReceiptSectionSchema = z.discriminatedUnion("type", [
  HeaderSectionSchema,
  DateTimeSectionSchema,
  CustomMessageSectionSchema,
  TwoColumnSectionSchema,
  ItemsListSectionSchema,
  PaymentSectionSchema,
  BarcodeSectionSchema,
]);
export type ReceiptSection = z.infer<typeof ReceiptSectionSchema>;

// =============================================================================
// Main Receipt Schema
// =============================================================================

export const ReceiptSchema = z.object({
  id: z.string(),
  name: z.string(),
  thumbnail: z.string().optional(),
  settings: SettingsSectionSchema,
  sections: z.array(ReceiptSectionSchema),
});
export type ReceiptType = z.infer<typeof ReceiptSchema>;

// =============================================================================
// Template Index Schema
// =============================================================================

export const TemplateInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  thumbnail: z.string().optional(),
});
export type TemplateInfo = z.infer<typeof TemplateInfoSchema>;

export const TemplateIndexSchema = z.object({
  templates: z.array(TemplateInfoSchema),
});
export type TemplateIndex = z.infer<typeof TemplateIndexSchema>;

// =============================================================================
// Default Values
// =============================================================================

export const DEFAULT_DIVIDER: DividerConfig = {
  enabled: false,
  style: "---",
};

export const DEFAULT_SETTINGS: SettingsSection = {
  currency: "$",
  currencyFormat: "prefix",
  font: "font1",
  textColor: "#000000",
  showBackground: {
    enabled: false,
    style: "1",
  },
};

export const DEFAULT_HEADER_SECTION: Omit<HeaderSection, "id"> = {
  type: "header",
  alignment: "center",
  logo: { url: "", size: 75 },
  businessDetails: "Your Business Name\n123 Main St\nAnytown, USA",
  divider: { enabled: true, style: "---" },
};

export const DEFAULT_DATETIME_SECTION: Omit<DateTimeSection, "id"> = {
  type: "datetime",
  alignment: "center",
  dateTime: new Date().toISOString(),
  divider: { enabled: false, style: "---" },
};

export const DEFAULT_CUSTOM_MESSAGE_SECTION: Omit<CustomMessageSection, "id"> = {
  type: "custom_message",
  alignment: "center",
  message: "Thank you for your purchase!",
  divider: { enabled: false, style: "---" },
};

export const DEFAULT_TWO_COLUMN_SECTION: Omit<TwoColumnSection, "id"> = {
  type: "two_column",
  column1: [{ key: "Item", value: "" }],
  column2: [{ key: "Price", value: "" }],
  divider: { enabled: false, style: "---" },
};

export const DEFAULT_ITEMS_LIST_SECTION: Omit<ItemsListSection, "id"> = {
  type: "items_list",
  items: [{ quantity: 1, name: "Item 1", price: 10.0 }],
  divider: { enabled: true, style: "---" },
  totalLines: [{ title: "Subtotal", value: 10.0 }],
  total: { title: "Total", value: 10.0 },
  increaseTotalSize: { enabled: true, percentage: "+50%" },
  bottomDivider: { enabled: true, style: "---" },
};

export const DEFAULT_PAYMENT_SECTION: Omit<PaymentSection, "id"> = {
  type: "payment",
  paymentType: "card",
  lines: [
    { title: "Card number", value: "****-****-****-1234" },
    { title: "Status", value: "APPROVED" },
  ],
  divider: { enabled: true, style: "---" },
};

export const DEFAULT_BARCODE_SECTION: Omit<BarcodeSection, "id"> = {
  type: "barcode",
  size: 50,
  length: 100,
  divider: { enabled: false, style: "---" },
};

// =============================================================================
// Helper Functions
// =============================================================================

export function createSection<T extends Omit<ReceiptSection, "id">>(
  section: T
): T & { id: string } {
  return {
    ...section,
    id: `${section.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

