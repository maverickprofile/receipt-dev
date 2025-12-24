// Components
import { BaseFooter, BaseNavbar } from "@/app/components";
import PaymentVerifier from "@/app/components/PaymentVerifier";
// ShadCn
import { Toaster } from "@/components/ui/toaster";
// Contexts
import Providers from "@/contexts/Providers";
// React
import { Suspense } from "react";
// Fonts
import {
    alexBrush,
    dancingScript,
    greatVibes,
    outfit,
    parisienne,
    robotoMono,
    spaceMono,
    inconsolata,
    libreBarcode39,
} from "@/lib/fonts";
// SEO
import { JSONLD, ROOTKEYWORDS } from "@/lib/seo";
// Variables
import { BASE_URL, GOOGLE_SC_VERIFICATION, LOCALES } from "@/lib/variables";
// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";
// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
// Next Intl
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "MakeReceipt | Free Receipt Generator",
    description:
        "Create receipts effortlessly with MakeReceipt, the free receipt generator. Try it now!",
    icons: [{ rel: "icon", url: Favicon.src }],
    keywords: ROOTKEYWORDS,
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: BASE_URL,
    },
    // Original author - commented out
    // authors: {
    //     name: "Ali Abbasov",
    //     url: "https://aliabb.vercel.app",
    // },
    verification: {
        google: GOOGLE_SC_VERIFICATION,
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export function generateStaticParams() {
    // Next.js expects an array of objects: [{ locale: 'en' },
    // ...]
    const locales = LOCALES.map((locale) => ({ locale: locale.code }));
    return locales;
}

export default async function LocaleLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;

    const { locale } = params;

    const { children } = props;

    let messages;
    try {
        messages = (await import(`@/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <head suppressHydrationWarning>
                <script
                    type="application/ld+json"
                    id="json-ld"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
                />
                {/* Buy Me a Coffee widget - commented out */}
                {/* <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="aliabb" data-description="Support me on Buy me a coffee!" data-message="Thank you for using Invoify" data-color="#5F7FFF" data-position="Right" data-x_margin="18" data-y_margin="18"></script> */}
            </head>
            <body
                className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} ${robotoMono.variable} ${spaceMono.variable} ${inconsolata.variable} ${libreBarcode39.variable} antialiased bg-slate-100 dark:bg-slate-800`}
                suppressHydrationWarning
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>
                        <BaseNavbar />

                        <div className="flex flex-col">{children}</div>

                        <BaseFooter />

                        {/* Toast component */}
                        <Toaster />

                        {/* Payment verification on return from Dodo */}
                        <Suspense fallback={null}>
                            <PaymentVerifier />
                        </Suspense>

                        {/* Vercel analytics */}
                        <Analytics />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
