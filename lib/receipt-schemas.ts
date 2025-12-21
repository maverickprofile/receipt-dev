import { z } from "zod";

// =============================================================================
// Enums & Basic Types
// =============================================================================

export const DividerStyleSchema = z.enum(["---", "===", "...", ":::", "***", "blank"]);
export type DividerStyle = z.infer<typeof DividerStyleSchema>;

export const DividerConfigSchema = z.object({
  enabled: z.boolean(),
  style: DividerStyleSchema,
});
export type DividerConfig = z.infer<typeof DividerConfigSchema>;

export const AlignmentSchema = z.enum(["left", "center", "right"]);
export type Alignment = z.infer<typeof AlignmentSchema>;

export const CurrencyFormatSchema = z.enum(["prefix", "suffix", "suffix_space"]);
export type CurrencyFormat = z.infer<typeof CurrencyFormatSchema>;

export const FontStyleSchema = z.enum(["font1", "font2", "font3", "hypermarket", "ocr-b"]);
export type FontStyle = z.infer<typeof FontStyleSchema>;

export const BackgroundStyleSchema = z.enum(["1", "2", "3", "4", "5"]);
export type BackgroundStyle = z.infer<typeof BackgroundStyleSchema>;

export const PdfSizeSchema = z.enum(["80mm", "110mm", "A4"]);
export type PdfSize = z.infer<typeof PdfSizeSchema>;

export const PaymentTypeSchema = z.enum(["Cash", "Credit Card", "Debit Card", "Mobile Payment"]);
export type PaymentType = z.infer<typeof PaymentTypeSchema>;

// Helper types for UI components
export type PaymentMethod = "Cash" | "Credit Card";
export type PaymentLine = { title: string; value: string };
export type KeyValuePair = { key: string; value: string };

export const BarcodeCodeTypeSchema = z.enum(["CODE128", "EAN13", "UPC_A", "QR_CODE"]);
export type BarcodeCodeType = z.infer<typeof BarcodeCodeTypeSchema>;

// =============================================================================
// Section Schemas
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
  pdfSize: PdfSizeSchema.default("80mm"),
  watermark: z.boolean().default(true),
});
export type SettingsSection = z.infer<typeof SettingsSectionSchema>;

export const HeaderSectionSchema = z.object({
  id: z.string(),
  type: z.literal("header"),
  alignment: AlignmentSchema,
  showLogo: z.boolean(),
  logoUrl: z.string().optional(),
  logoWidth: z.number().optional(),
  businessName: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  extraInfo: z.string().optional(),
  divider: DividerConfigSchema,
});
export type HeaderSection = z.infer<typeof HeaderSectionSchema>;

export const DateTimeSectionSchema = z.object({
  id: z.string(),
  type: z.literal("datetime"),
  alignment: AlignmentSchema,
  dateTime: z.string(), // ISO string
  divider: DividerConfigSchema,
});
export type DateTimeSection = z.infer<typeof DateTimeSectionSchema>;

export const CustomMessageSectionSchema = z.object({
  id: z.string(),
  type: z.literal("custom_message"),
  alignment: AlignmentSchema,
  message: z.string(),
  divider: DividerConfigSchema,
});
export type CustomMessageSection = z.infer<typeof CustomMessageSectionSchema>;

export const TwoColumnSectionSchema = z.object({
  id: z.string(),
  type: z.literal("two_column"),
  column1: z.array(z.object({ key: z.string(), value: z.string() })),
  column2: z.array(z.object({ key: z.string(), value: z.string() })),
  divider: DividerConfigSchema,
});
export type TwoColumnSection = z.infer<typeof TwoColumnSectionSchema>;

export const ItemsListSectionSchema = z.object({
  id: z.string(),
  type: z.literal("items_list"),
  headers: z.object({
    qty: z.string(),
    item: z.string(),
    price: z.string(),
  }),
  items: z.array(
    z.object({
      quantity: z.number(),
      name: z.string(),
      price: z.number(),
    })
  ),
  showTotals: z.boolean(),
  totalLines: z.array(z.object({ title: z.string(), value: z.number() })).optional(),
  total: z.object({ title: z.string(), value: z.number() }).optional(),
  increaseTotalSize: z.object({ enabled: z.boolean(), percentage: z.string() }).optional(),
  divider: DividerConfigSchema,
  bottomDivider: DividerConfigSchema.optional(),
});
export type ItemsListSection = z.infer<typeof ItemsListSectionSchema>;

export const PaymentSectionSchema = z.object({
  id: z.string(),
  type: z.literal("payment"),
  method: z.string(), // Allowing free text or enum? Using string for flexibility or PaymentTypeSchema? Let's use string to support custom methods if needed, or PaymentTypeSchema. The default uses "Credit Card".
  cardDetails: z.object({
    cardType: z.string(),
    cardNumber: z.string(),
  }).optional(),
  customLines: z.array(z.object({ title: z.string(), value: z.string() })),
  divider: DividerConfigSchema,
});
export type PaymentSection = z.infer<typeof PaymentSectionSchema>;

export const BarcodeSectionSchema = z.object({
  id: z.string(),
  type: z.literal("barcode"),
  codeType: BarcodeCodeTypeSchema,
  value: z.string(),
  showText: z.boolean(),
  height: z.number(),
  width: z.number(),
  divider: DividerConfigSchema,
});
export type BarcodeSection = z.infer<typeof BarcodeSectionSchema>;

// Union of all sections
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
export type SectionType = ReceiptSection["type"];

export const ReceiptTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  settings: SettingsSectionSchema,
  sections: z.array(ReceiptSectionSchema),
});
export type ReceiptType = z.infer<typeof ReceiptTypeSchema>;

// =============================================================================
// Default Values
// =============================================================================

export const DEFAULT_SETTINGS: SettingsSection = {
  currency: "$",
  currencyFormat: "prefix",
  font: "font1",
  textColor: "#000000",
  showBackground: {
    enabled: false,
    style: "1",
  },
  pdfSize: "80mm",
  watermark: true,
};

export const DEFAULT_HEADER_SECTION: Omit<HeaderSection, "id"> = {
  type: "header",
  alignment: "center",
  showLogo: false,
  logoUrl: "",
  logoWidth: 100,
  businessName: "Your Business Name",
  address: "123 Main St\nAnytown, USA 12345",
  phone: "",
  website: "",
  extraInfo: "",
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
  column1: [
    { key: "Table", value: "415" },
    { key: "Server", value: "Rebecca" },
  ],
  column2: [{ key: "Guests", value: "2" }],
  divider: { enabled: false, style: "---" },
};

export const DEFAULT_ITEMS_LIST_SECTION: Omit<ItemsListSection, "id"> = {
  type: "items_list",
  headers: { qty: "Qty", item: "Item", price: "Price" },
  items: [{ quantity: 1, name: "Item 1", price: 10.0 }],
  showTotals: true,
  divider: { enabled: true, style: "---" },
  totalLines: [{ title: "Subtotal", value: 10.0 }],
  total: { title: "Total", value: 10.0 },
  increaseTotalSize: { enabled: true, percentage: "+50%" },
  bottomDivider: { enabled: true, style: "---" },
};

export const DEFAULT_PAYMENT_SECTION: Omit<PaymentSection, "id"> = {
  type: "payment",
  method: "Cash",
  cardDetails: {
    cardType: "VISA",
    cardNumber: "****-****-****-1234",
  },
  customLines: [
    { title: "Cash", value: "20.00" },
    { title: "Change", value: "3.45" },
  ],
  divider: { enabled: true, style: "---" },
};

export const DEFAULT_BARCODE_SECTION: Omit<BarcodeSection, "id"> = {
  type: "barcode",
  codeType: "CODE128",
  value: "",
  showText: true,
  height: 50,
  width: 100,
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
