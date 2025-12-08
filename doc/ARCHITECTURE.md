# Invoify Architecture & Layout

## Stack & Runtime
- Next.js App Router (15), React 18, TypeScript, Tailwind + shadcn/ui.
- State: React Hook Form + Zod; contexts for invoice actions, charges, signature, theme, translations.
- i18n: `next-intl` with locale-prefixed routing via middleware.
- PDF: Puppeteer (`puppeteer-core` + `@sparticuz/chromium` in prod, `puppeteer` locally).
- Email: Nodemailer + React Email.

## Directory Map (high level)
- `app/`
  - `layout.tsx`, `page.tsx` redirect to `/en`, `globals.css`, `middleware.ts`.
  - `[locale]/layout.tsx` (intl provider, Providers, navbar/footer, analytics, metadata).
  - `[locale]/page.tsx` renders `InvoiceMain`.
  - `[locale]/template/[id]/page.tsx` dynamic PDF template preview inside RHF context.
  - `[locale]/[...rest]/page.tsx`, root `not-found.tsx` for 404.
  - `api/invoice/{generate,export,send}/route.ts` -> server services.
- `app/components/` UI modules re-exported via `app/components/index.ts`.
  - Layout: navbar/footer.
  - Invoice: `InvoiceMain`, `InvoiceForm`, actions (preview/download), form sections, wizard, template selector.
  - Templates: `templates/invoice-pdf/*` (renderable in browser and server).
  - Modals: export/import, saved list, email send, signature.
  - Reusables: buttons, inputs, language/theme toggles, etc.
- `components/ui/` shadcn primitives.
- `contexts/` Providers (Theme/Translation/RHF/Invoice/Charges/Signature).
- `services/`
  - `invoice/server/`: `generatePdfService`, `exportInvoiceService`, `sendPdfToEmailService`.
  - `invoice/client/`: `exportInvoice` helper (triggers downloads).
- `hooks/`: `useCurrencies`, `useToasts`.
- `lib/`: `schemas` (Zod), `variables` (constants/env/defaults), `helpers` (formatting, template loader, buffers), `seo`, `fonts`, `utils` (`cn`).
- `i18n/`: routing, request config, locale JSON files.
- `public/`: assets, currency data.
- `config`: `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `puppeteer.config.cjs`.

## Core Data & Form Flow
- `Providers` creates RHF form with `InvoiceSchema` + defaults, hydrates from `localStorage` draft key, wraps ThemeProvider, TranslationProvider, InvoiceContext, ChargesContext.
- `InvoiceContext` handles:
  - `generatePdf` -> POST `/api/invoice/generate` -> Blob + toast.
  - `saveInvoice`/`deleteInvoice` localStorage `savedInvoices`.
  - `sendPdfToMail` -> FormData POST `/api/invoice/send`.
  - `exportInvoiceAs` -> client helper -> `/api/invoice/export?format=...`.
  - `importInvoice` JSON -> reset form (date revival).
  - download/print/open/remove PDF, new invoice reset.
- `ChargesContext` watches RHF values, toggles discount/tax/shipping, computes subtotal/total, writes total-in-words via `formatPriceToString`.
- Form UI: `InvoiceMain` hosts form + actions; sections under `invoice/form/sections/*`; live preview/PDF viewer in `invoice/actions/*`; template selector chooses `details.pdfTemplate`.

## Server Behaviors
- PDF generation: `generatePdfService` renders selected template with ReactDOMServer, loads Tailwind CDN, launches puppeteer, returns PDF.
- Export: `exportInvoiceService` supports JSON/CSV/XML (XLSX stubbed); uses json2csv/xml2js.
- Email: `sendPdfToEmailService` checks env, renders React Email template, converts uploaded PDF File to buffer, sends via Gmail service.

## Internationalization
- Locales list in `lib/variables.LOCALES`; `routing.ts` + `middleware.ts` enforce locale segment.
- `NextIntlClientProvider` in `[locale]/layout.tsx`; messages per `i18n/locales/*.json`.
- `TranslationContext` exposes `_t` wrapper around `useTranslations`.

## Styling/Theming
- Tailwind base tokens in `globals.css`; light/dark via `next-themes`.
- Fonts: Outfit base + signature fonts (Dancing Script, Parisienne, Great Vibes, Alex Brush) defined in `lib/fonts.ts`.

## Environment & Config
- Required for email: `NODEMAILER_EMAIL`, `NODEMAILER_PW`; optional `GOOGLE_SC_VERIFICATION`.
- APIs: `/api/invoice/generate`, `/api/invoice/export`, `/api/invoice/send`; external currencies API from openexchangerates.
- Scripts: `npm run dev`, `build`, `start`, `lint`, `analyze` (bundle analyzer).

## Extension Points
- Add/modify templates: `app/components/templates/invoice-pdf/*` and ensure `details.pdfTemplate` references.
- Add locales: create `i18n/locales/<code>.json`, register in `lib/variables.LOCALES`.
- Enable XLSX export: uncomment/finish XLSX block in `exportInvoiceService`.
- Additional fields: extend `lib/schemas.ts`, `variables.FORM_DEFAULT_VALUES`, relevant form components and contexts.

## Quick Start
- `npm install`
- (Optional) `.env.local` for email:
  - `NODEMAILER_EMAIL=...`
  - `NODEMAILER_PW=...`
- `npm run dev` -> open `http://localhost:3000` (redirects to `/en`).

