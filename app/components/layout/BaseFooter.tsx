"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Receipt } from "lucide-react";

const BaseFooter = () => {
    const params = useParams();
    const locale = (params.locale as string) || "en";

    const footerLinks = [
        { name: "Receipt Maker", href: `/${locale}/generate` },
        { name: "Templates", href: `/${locale}/templates` },
        { name: "Examples", href: `/${locale}/examples` },
        { name: "Generate Receipt", href: `/${locale}/generate` },
        { name: "Terms & Conditions", href: `/${locale}/terms` },
        { name: "Privacy Policy", href: `/${locale}/privacy` },
    ];

    return (
        <footer className="bg-gray-900 text-white py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Logo and Description */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold">ReceiptMaker</span>
                    </div>
                    <p className="text-gray-400 text-sm max-w-md">
                        Make receipts with custom information from selected templates in seconds!
                    </p>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 mb-6 sm:mb-8">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                            © {new Date().getFullYear()} ReceiptMaker. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Hi! Ask any question here!</span>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                                <span className="text-white text-sm">?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default BaseFooter;
