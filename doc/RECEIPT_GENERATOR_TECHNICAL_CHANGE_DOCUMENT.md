# Receipt Generator - Technical Change Document

## Overview

This document outlines all technical changes made to extend the Invoify application to include a Receipt Generator feature, similar to ReceiptFaker.com.

**Date:** December 8, 2025  
**Feature:** Receipt Generator  
**Reference:** https://www.receiptfaker.com/generate/Circle-K-Receipt

---

## Table of Contents

1. [Feature Summary](#feature-summary)
2. [Architecture Changes](#architecture-changes)
3. [New Files Created](#new-files-created)
4. [Modified Files](#modified-files)
5. [Schema Design](#schema-design)
6. [Component Hierarchy](#component-hierarchy)
7. [Template System](#template-system)
8. [API Endpoints](#api-endpoints)
9. [State Management](#state-management)
10. [Data Flow](#data-flow)
11. [Dependencies](#dependencies)
12. [Testing Considerations](#testing-considerations)
13. [Future Enhancements](#future-enhancements)

---

## Feature Summary

The Receipt Generator allows users to:
- Select from pre-defined receipt templates (Circle K, Generic, etc.)
- Customize receipt sections via a form interface
- Drag-and-drop to reorder sections
- Add, remove, and duplicate sections
- Generate PDF receipts
- Save/Load receipts from local storage
- Export/Import receipts as JSON files

### Supported Section Types

| Section Type | Description |
|--------------|-------------|
| **Header** | Business name, logo, address |
| **Date & Time** | Configurable date/time display |
| **Custom Message** | Free-text message area |
| **Two Column** | Key-value pairs in two columns |
| **Items List** | Product items with quantity, price, totals |
| **Payment** | Payment method details (cash/card) |
| **Barcode** | Configurable barcode display |

---

## Architecture Changes

### Design Principles

1. **Separation from Invoice Module**: Receipt functionality is completely separate from the existing invoice module
2. **Template-Driven**: Receipts are defined by JSON template files
3. **Context-Based State**: Uses React Context for state management (similar to InvoiceContext)
4. **Server-Side PDF Generation**: Uses Puppeteer for PDF generation

### Directory Structure

```
invoify-dev/
├── app/
│   ├── [locale]/
│   │   └── receipt/
│   │       ├── templates/
│   │       │   └── page.tsx          # Template selection page
│   │       └── generate/
│   │           └── [template]/
│   │               └── page.tsx      # Receipt generator page
│   ├── api/
│   │   └── receipt/
│   │       └── generate/
│   │           └── route.ts          # PDF generation API
│   └── components/
│       ├── receipt/
│       │   ├── form/
│       │   │   ├── sections/         # Form section components
│       │   │   └── SortableSectionList.tsx
│       │   ├── actions/
│       │   │   ├── ReceiptActions.tsx
│       │   │   └── ReceiptPreview.tsx
│       │   ├── ReceiptForm.tsx
│       │   └── ReceiptMain.tsx
│       └── templates/
│           └── receipt/
│               └── ReceiptTemplate.tsx
├── contexts/
│   └── ReceiptContext.tsx
├── lib/
│   └── receipt-schemas.ts            # Zod schemas
├── public/
│   └── assets/
│       └── data/
│           └── receipt-templates/    # JSON template files
└── services/
    └── receipt/
        └── server/
            └── generateReceiptPdfService.ts
```

---

## New Files Created

### Schema & Types

| File | Purpose |
|------|---------|
| `lib/receipt-schemas.ts` | Zod schemas for all receipt sections and types |

### Context

| File | Purpose |
|------|---------|
| `contexts/ReceiptContext.tsx` | Global state management for receipts |

### UI Components

| File | Purpose |
|------|---------|
| `components/ui/collapsible.tsx` | Collapsible UI component (Radix UI) |
| `components/ui/slider.tsx` | Slider UI component (Radix UI) |
| `components/ui/dropdown-menu.tsx` | Dropdown menu component (Radix UI) |

### Form Section Components

| File | Purpose |
|------|---------|
| `app/components/receipt/form/sections/AlignmentSelector.tsx` | Text alignment selector |
| `app/components/receipt/form/sections/DividerConfig.tsx` | Divider configuration |
| `app/components/receipt/form/sections/SectionWrapper.tsx` | Collapsible section wrapper with drag handle |
| `app/components/receipt/form/sections/SettingsSection.tsx` | Global receipt settings |
| `app/components/receipt/form/sections/HeaderSectionForm.tsx` | Header section form |
| `app/components/receipt/form/sections/DateTimeSectionForm.tsx` | Date/time section form |
| `app/components/receipt/form/sections/CustomMessageSectionForm.tsx` | Custom message form |
| `app/components/receipt/form/sections/TwoColumnSectionForm.tsx` | Two-column key-value form |
| `app/components/receipt/form/sections/ItemsListSectionForm.tsx` | Items list with totals |
| `app/components/receipt/form/sections/PaymentSectionForm.tsx` | Payment details form |
| `app/components/receipt/form/sections/BarcodeSectionForm.tsx` | Barcode configuration |
| `app/components/receipt/form/sections/index.ts` | Section exports |

### Main Components

| File | Purpose |
|------|---------|
| `app/components/receipt/form/SortableSectionList.tsx` | Drag-and-drop section list |
| `app/components/receipt/ReceiptForm.tsx` | Main receipt form |
| `app/components/receipt/actions/ReceiptActions.tsx` | Action buttons |
| `app/components/receipt/actions/ReceiptPreview.tsx` | Live/PDF preview |
| `app/components/receipt/ReceiptMain.tsx` | Main wrapper component |

### Template

| File | Purpose |
|------|---------|
| `app/components/templates/receipt/ReceiptTemplate.tsx` | Receipt rendering template |

### Pages

| File | Purpose |
|------|---------|
| `app/[locale]/receipt/templates/page.tsx` | Template selection page |
| `app/[locale]/receipt/generate/[template]/page.tsx` | Receipt generator page |

### API & Services

| File | Purpose |
|------|---------|
| `app/api/receipt/generate/route.ts` | PDF generation API route |
| `services/receipt/server/generateReceiptPdfService.ts` | PDF generation service |

### Template Data

| File | Purpose |
|------|---------|
| `public/assets/data/receipt-templates/index.json` | Template registry |
| `public/assets/data/receipt-templates/circle-k.json` | Circle K template |
| `public/assets/data/receipt-templates/generic.json` | Generic template |

---

## Modified Files

| File | Changes |
|------|---------|
| `lib/variables.ts` | Added receipt-related constants (API endpoints, local storage keys, section types) |
| `types.ts` | Added receipt type exports |
| `app/components/layout/BaseNavbar.tsx` | Added Invoice/Receipt navigation buttons |

---

## Schema Design

### Main Receipt Schema

```typescript
ReceiptSchema = {
  id: string,
  name: string,
  thumbnail?: string,
  settings: SettingsSection,
  sections: ReceiptSection[]
}
```

### Settings Section

```typescript
SettingsSection = {
  currency: string,           // e.g., "$"
  currencyFormat: "prefix" | "suffix" | "suffix_space",
  font: "font1" | "font2" | "font3",
  textColor: string,          // Hex color
  showBackground: {
    enabled: boolean,
    style: "1" | "2" | "3" | "4" | "5"
  }
}
```

### Section Types

All sections share common fields:
- `id`: Unique identifier
- `type`: Section type discriminator
- `divider`: Divider configuration

#### Header Section
```typescript
{
  type: "header",
  alignment: "left" | "center" | "right",
  logo: { url: string, size: number },
  businessDetails: string,
  divider: DividerConfig
}
```

#### Items List Section
```typescript
{
  type: "items_list",
  items: Array<{ quantity: number, name: string, price: number }>,
  divider: DividerConfig,
  totalLines: Array<{ title: string, value: number }>,
  total: { title: string, value: number },
  increaseTotalSize: { enabled: boolean, percentage: string },
  bottomDivider: DividerConfig
}
```

---

## Component Hierarchy

```
ReceiptContextProvider
└── ReceiptMain
    ├── ReceiptForm
    │   ├── SettingsSection (fixed)
    │   ├── SortableSectionList
    │   │   └── SortableItem (for each section)
    │   │       └── SectionWrapper
    │   │           └── [SectionForm] (Header, DateTime, etc.)
    │   └── AddSection Dropdown
    ├── ReceiptActions
    │   ├── Generate PDF
    │   ├── Download/Print/Open
    │   └── Save/Reset/Export/Import
    └── ReceiptPreview
        └── ReceiptTemplate (live) or PDF iframe
```

---

## Template System

### Template Index (`index.json`)

```json
{
  "templates": [
    {
      "id": "circle-k",
      "name": "Circle K Receipt",
      "thumbnail": "/assets/img/receipts/circle-k-thumb.png"
    }
  ]
}
```

### Template File (`circle-k.json`)

Contains full receipt configuration with:
- Default settings
- Pre-configured sections in desired order
- Sample data

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/receipt/generate` | POST | Generate PDF from receipt data |

### Request Body

```typescript
{
  id: string,
  name: string,
  settings: SettingsSection,
  sections: ReceiptSection[]
}
```

### Response

- **Success**: PDF blob with `application/pdf` content type
- **Error**: JSON with error message

---

## State Management

### ReceiptContext Functions

| Function | Purpose |
|----------|---------|
| `loadTemplate(templateId)` | Load template from JSON file |
| `resetToTemplate()` | Reset to original template state |
| `updateSettings(updates)` | Update global settings |
| `addSection(type, index?)` | Add new section |
| `removeSection(sectionId)` | Remove section |
| `updateSection(sectionId, updates)` | Update section data |
| `reorderSections(startIndex, endIndex)` | Reorder sections |
| `duplicateSection(sectionId)` | Duplicate a section |
| `generatePdf()` | Generate PDF |
| `downloadPdf()` | Download generated PDF |
| `printPdf()` | Print generated PDF |
| `saveReceipt()` | Save to local storage |
| `deleteReceipt(index)` | Delete from saved receipts |
| `loadReceipt(receipt)` | Load saved receipt |
| `exportReceiptAsJson()` | Export as JSON file |
| `importReceipt(file)` | Import from JSON file |

### Local Storage Keys

- `invoify:receiptDraft` - Current draft
- `invoify:savedReceipts` - Array of saved receipts

---

## Data Flow

```
1. User selects template
   └── loadTemplate() fetches JSON → sets receipt state

2. User edits form
   └── updateSection/updateSettings → updates receipt state
   └── Auto-saves to localStorage

3. User generates PDF
   └── generatePdf() → POST to /api/receipt/generate
   └── Server renders ReceiptTemplate → Puppeteer generates PDF
   └── PDF blob stored in context → displayed in preview

4. User saves/exports
   └── saveReceipt() → localStorage
   └── exportReceiptAsJson() → downloads JSON file
```

---

## Dependencies

### New Dependencies Used

| Package | Purpose |
|---------|---------|
| `@dnd-kit/core` | Drag and drop functionality |
| `@dnd-kit/sortable` | Sortable list functionality |
| `@dnd-kit/utilities` | DnD utilities |
| `@radix-ui/react-collapsible` | Collapsible component |
| `@radix-ui/react-slider` | Slider component |
| `@radix-ui/react-dropdown-menu` | Dropdown menu component |

### Existing Dependencies Reused

- `zod` - Schema validation
- `puppeteer` / `puppeteer-core` - PDF generation
- `@sparticuz/chromium` - Chromium for serverless
- `lucide-react` - Icons

---

## Testing Considerations

### Manual Testing Checklist

- [ ] Template selection page loads all templates
- [ ] Receipt form loads with default template data
- [ ] All section types can be added/removed
- [ ] Drag-and-drop reordering works
- [ ] Section duplication works
- [ ] Settings changes reflect in preview
- [ ] PDF generation works
- [ ] PDF download/print works
- [ ] Save/Load from local storage works
- [ ] Export/Import JSON works
- [ ] Navigation between Invoice and Receipt works

### Edge Cases

- Empty sections array
- Very long item lists
- Special characters in text fields
- Invalid JSON import
- Large logo images

---

## Future Enhancements

1. **More Templates**: Add Walmart, Target, Amazon, etc.
2. **Load/Export Modals**: Match Invoice UI with modal-based load/export
3. **Receipt Thumbnails**: Generate thumbnails for templates
4. **Background Images**: Add actual receipt background images
5. **Custom Fonts**: Allow more font options
6. **Print Sizing**: Optimize for thermal printer paper sizes
7. **QR Code Support**: Add QR code section type
8. **Multi-language**: Internationalize receipt UI
9. **Cloud Storage**: Save receipts to cloud instead of local storage
10. **Template Editor**: Allow users to create custom templates

---

## Conclusion

The Receipt Generator feature has been successfully implemented with:
- Clean separation from invoice module
- Flexible, template-driven architecture
- Full CRUD operations for sections
- Drag-and-drop reordering
- PDF generation capability
- Local storage persistence
- JSON import/export

The architecture allows for easy addition of new templates and section types in the future.

