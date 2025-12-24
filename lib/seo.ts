import { AUTHOR_WEBSITE, BASE_URL } from "@/lib/variables";

export const ROOTKEYWORDS = [
    "receipt",
    "receipt generator",
    "receipt maker",
    "receipt template",
    "free receipt generator",
    "invoice",
    "invoice generator",
];

export const JSONLD = {
    "@context": "https://schema.org",
    "@type": "Website",
    name: "MakeReceipt",
    description: "A Receipt Generator Web App",
    keywords: ROOTKEYWORDS,
    url: BASE_URL,
    image: "/assets/img/receiptmaker-logo.svg",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#website`,
    },
    // Author information - commented out
    // author: {
    //     "@type": "Person",
    //     name: "Ali Abbasov",
    //     url: AUTHOR_WEBSITE,
    // },
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            url: `${BASE_URL}`,
        },
    ],
};
