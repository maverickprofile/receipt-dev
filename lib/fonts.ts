// Next Google Fonts
import {
    Alex_Brush,
    Dancing_Script,
    Great_Vibes,
    Outfit,
    Parisienne,
    Roboto_Mono,
    Space_Mono,
    Inconsolata,
    Libre_Barcode_39,
} from "next/font/google";

// Default Fonts
export const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: false,
});

// Signature fonts
export const dancingScript = Dancing_Script({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-dancing-script",
    preload: true,
    display: "swap",
});

export const parisienne = Parisienne({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-parisienne",
    preload: true,
    display: "swap",
});

export const greatVibes = Great_Vibes({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-great-vibes",
    preload: true,
    display: "swap",
});

export const alexBrush = Alex_Brush({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-alex-brush",
    preload: true,
    display: "swap",
});

// Receipt Fonts
export const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-roboto-mono",
    display: "swap",
});

export const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-space-mono",
    display: "swap",
});

export const inconsolata = Inconsolata({
    subsets: ["latin"],
    variable: "--font-inconsolata",
    display: "swap",
});

export const libreBarcode39 = Libre_Barcode_39({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-libre-barcode-39",
    display: "swap",
});
