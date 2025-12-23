"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Receipt, ArrowRight, Search } from "lucide-react";
import { generateTemplateSlug } from "@/lib/utils";
import type { TemplateInfo } from "@/lib/receipt-schemas";

interface TemplatesGridProps {
    templates: TemplateInfo[];
    locale: string;
}

export default function TemplatesGrid({ templates, locale }: TemplatesGridProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const filteredTemplates = useMemo(() => {
        let filtered = templates.filter((template) =>
            template.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort templates
        if (sortOrder === "newest") {
            // Keep original order (newest first)
            filtered = [...filtered];
        } else if (sortOrder === "oldest") {
            filtered = [...filtered].reverse();
        } else if (sortOrder === "a-z") {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "z-a") {
            filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        }

        return filtered;
    }, [templates, searchQuery, sortOrder]);

    return (
        <>
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 sm:pl-12 pr-4 py-2 sm:py-3 h-10 sm:h-12 rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm sm:text-base"
                    />
                </div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full sm:w-[120px] md:w-[140px] h-10 sm:h-12 rounded-full border-gray-300 dark:border-gray-600 text-sm">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="a-z">A-Z</SelectItem>
                        <SelectItem value="z-a">Z-A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {filteredTemplates.map((template) => {
                    const slug = generateTemplateSlug(template.name);
                    return (
                        <Link
                            key={template.id}
                            href={`/${locale}/template/${slug}`}
                            className="group"
                        >
                            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer bg-white dark:bg-slate-800">
                                <CardContent className="p-0">
                                    {/* Thumbnail */}
                                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden relative p-1 sm:p-2">
                                        {template.thumbnail ? (
                                            <img
                                                src={template.thumbnail}
                                                alt={template.name}
                                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <Receipt className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
                                        )}
                                        {/* Hover Overlay - hidden on mobile */}
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300 hidden sm:flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                                                    Use Template
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Name */}
                                    <div className="p-2 sm:p-3 text-center">
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {template.name}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}

                {/* Coming Soon Card - only show if no search */}
                {!searchQuery && (
                    <Card className="h-full border-dashed border-2 border-gray-300 dark:border-gray-600 bg-transparent">
                        <CardContent className="p-0 h-full flex flex-col items-center justify-center aspect-[3/4]">
                            <div className="text-center p-3 sm:p-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                    <span className="text-xl sm:text-2xl text-gray-400">+</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    More coming soon
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* No results message */}
            {filteredTemplates.length === 0 && searchQuery && (
                <div className="text-center py-8 sm:py-12">
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        No templates found for &quot;{searchQuery}&quot;
                    </p>
                </div>
            )}
        </>
    );
}
