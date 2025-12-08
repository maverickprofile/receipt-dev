# Receipt Generator - Planning Document

## Project Overview

**Project Name:** Invoify Receipt Generator Extension  
**Start Date:** December 8, 2025  
**Reference Implementation:** https://www.receiptfaker.com/generate/Circle-K-Receipt

---

## Background

The existing Invoify project is an invoice generation tool. This extension adds a Receipt Generator feature that allows users to create customizable receipts based on pre-defined templates.

### Use Cases

1. **Lost Receipt Replacement**: Users who have lost a receipt can recreate it
2. **Expense Reporting**: Generate receipts for tools like QuickBooks
3. **Testing & Development**: Create test receipts for applications

---

## Requirements Analysis

### Functional Requirements

1. **Template Selection**
   - Display available receipt templates
   - Allow users to select a template to customize

2. **Receipt Form**
   - Support multiple section types
   - Allow drag-and-drop reordering
   - Allow adding/removing sections
   - Allow duplicating sections
   - Provide global settings (currency, font, colors)

3. **PDF Generation**
   - Generate PDF from receipt data
   - Download, print, and preview PDF

4. **Data Persistence**
   - Save receipts to local storage
   - Load saved receipts
   - Export receipts as JSON
   - Import receipts from JSON

### Non-Functional Requirements

1. **Separation of Concerns**: Receipt module should be separate from Invoice module
2. **Consistency**: Follow existing code patterns and conventions
3. **Extensibility**: Easy to add new templates and section types
4. **Performance**: Quick PDF generation

---

## Section Types Analysis

Based on analysis of https://www.receiptfaker.com/generate/Circle-K-Receipt:

### 1. Settings Section (Global)
- Currency symbol
- Currency format (prefix/suffix)
- Font selection
- Text color
- Background toggle with style options

### 2. Header Section
- Alignment (left/center/right)
- Logo with size control
- Business details (multi-line text)
- Divider configuration

### 3. Date & Time Section
- Alignment
- Date/time value
- Divider configuration

### 4. Custom Message Section
- Alignment
- Message text
- Divider configuration

### 5. Two Column Information Section
- Dynamic key-value pairs
- Divider configuration

### 6. Items List Section
- Item rows (quantity, name, price)
- Total lines (subtotal, tax, etc.)
- Final total with optional size increase
- Top and bottom dividers

### 7. Payment Section
- Payment type (cash/card)
- Dynamic payment detail lines
- Change due (for cash)
- Divider configuration

### 8. Barcode Section
- Alignment
- Show label toggle
- Barcode value
- Size controls (height, length, text size)
- Divider configuration

---

## Design Decisions

### Decision 1: Section-Based Architecture

**Options Considered:**
- A) Fixed sections (like invoice)
- B) Flexible section-based with drag-and-drop

**Decision:** Option B - Flexible sections

**Rationale:**
- Receipts vary significantly between templates
- Users need to add multiple instances of same section type
- Drag-and-drop provides better UX for receipt customization

### Decision 2: Template Storage

**Options Considered:**
- A) Hardcoded in TypeScript
- B) Database storage
- C) JSON files in public folder

**Decision:** Option C - JSON files

**Rationale:**
- Easy to add new templates
- No backend changes required
- Can be version controlled
- Works with static hosting

### Decision 3: State Management

**Options Considered:**
- A) React Hook Form (like Invoice)
- B) React Context with local state
- C) Redux/Zustand

**Decision:** Option B - React Context

**Rationale:**
- Simpler for dynamic section management
- Consistent with existing InvoiceContext pattern
- No additional dependencies
- Direct state manipulation easier for drag-and-drop

### Decision 4: PDF Generation

**Options Considered:**
- A) Client-side (jsPDF, html2canvas)
- B) Server-side (Puppeteer)

**Decision:** Option B - Server-side Puppeteer

**Rationale:**
- Consistent with existing invoice PDF generation
- Better quality output
- Supports complex styling
- Works with TailwindCSS

---

## Data Model Design

### Receipt JSON Structure

```json
{
  "id": "circle-k",
  "name": "Circle K Receipt",
  "thumbnail": "/assets/img/receipts/circle-k-thumb.png",
  "settings": {
    "currency": "$",
    "currencyFormat": "prefix",
    "font": "font1",
    "textColor": "#1a1a2e",
    "showBackground": {
      "enabled": true,
      "style": "1"
    }
  },
  "sections": [
    {
      "id": "header-1",
      "type": "header",
      "alignment": "center",
      "logo": { "url": "", "size": 75 },
      "businessDetails": "Circle K Service Station\n350 W Chicago Ave\nChicago, IL 60654",
      "divider": { "enabled": true, "style": "---" }
    }
  ]
}
```

### Section ID Generation

Each section has a unique ID generated using pattern: `{type}-{uuid}`

This allows:
- Multiple sections of same type
- Stable keys for React rendering
- Easy identification of section type

---

## UI/UX Design

### Template Selection Page
- Grid of template cards
- Thumbnail preview
- Click to navigate to generator

### Receipt Generator Page
- Two-column layout
  - Left: Form sections
  - Right: Preview + Actions
- Collapsible sections to reduce clutter
- Add Section dropdown at bottom

### Section Form Design
- Card-based with header containing:
  - Section icon and label
  - Collapse/expand toggle
  - Drag handle
  - Delete button
  - Duplicate button

---

## Navigation Design

### URL Structure

```
/[locale]/receipt/templates          - Template selection
/[locale]/receipt/generate/[template] - Receipt generator
```

### Navbar Updates

Added buttons to switch between:
- Invoice (existing functionality)
- Receipt (new functionality)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex drag-and-drop bugs | Medium | Medium | Use proven @dnd-kit library |
| PDF generation performance | Low | Medium | Reuse existing Puppeteer setup |
| Template JSON corruption | Low | High | Validate with Zod schema |
| Large file exports | Low | Low | JSON is compact |

---

## Implementation Phases

### Phase 1: Foundation ✅
- Create Zod schemas
- Set up template JSON structure
- Create template index

### Phase 2: State Management ✅
- Create ReceiptContext
- Implement load/save functionality
- Add local storage persistence

### Phase 3: UI Components ✅
- Create UI primitives (Collapsible, Slider, Dropdown)
- Create section form components
- Create SortableSectionList

### Phase 4: Main Components ✅
- Create ReceiptForm
- Create ReceiptActions
- Create ReceiptMain

### Phase 5: PDF Generation ✅
- Create ReceiptTemplate
- Create PDF generation service
- Create API route

### Phase 6: Pages ✅
- Create template selection page
- Create receipt generator page
- Update navbar

### Phase 7: Documentation ✅
- Create technical change document
- Create planning document

---

## Future Roadmap

### Short-term (Next Sprint)
- Add Load/Export modals (match Invoice UI)
- Add more receipt templates
- Generate template thumbnails

### Medium-term (Next Month)
- Add receipt background images
- Add QR code support
- Optimize for thermal printer sizes

### Long-term (Future)
- Cloud storage for receipts
- Template editor for custom templates
- Share receipts via link

---

## Conclusion

The Receipt Generator has been successfully planned and implemented following a systematic approach:

1. ✅ Analyzed reference implementation
2. ✅ Defined requirements
3. ✅ Made informed design decisions
4. ✅ Created comprehensive data models
5. ✅ Implemented in phases
6. ✅ Documented changes

The feature is now functional and ready for testing and iteration.

