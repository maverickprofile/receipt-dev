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
import { Receipt, ArrowRight, Search, ShoppingCart } from "lucide-react";
import { generateExampleSlug } from "@/lib/utils";

interface ExampleItem {
    id: string;
    templateName: string;
    templateId: string;
    title: string;
    items: { name: string }[];
    itemCount: number;
    total: number;
    totalFormatted: string;
    image: string;
}

interface ExamplesGridProps {
    examples: ExampleItem[];
    locale: string;
}

export default function ExamplesGrid({ examples, locale }: ExamplesGridProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const filteredExamples = useMemo(() => {
        let filtered = examples.filter((example) =>
            example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            example.templateName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort examples
        if (sortOrder === "newest") {
            filtered = [...filtered];
        } else if (sortOrder === "oldest") {
            filtered = [...filtered].reverse();
        } else if (sortOrder === "a-z") {
            filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === "z-a") {
            filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
        }

        return filtered;
    }, [examples, searchQuery, sortOrder]);

    return (
        <>
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search examples..."
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

            {/* Examples Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredExamples.map((example) => {
                    const exampleSlug = generateExampleSlug(example.templateName, example.items, example.total);
                    return (
                        <Link
                            key={example.id}
                            href={`/${locale}/example/${exampleSlug}`}
                            className="group"
                        >
                            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer bg-white dark:bg-slate-800">
                                <CardContent className="p-0">
                                    {/* Receipt Preview */}
                                    <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden relative p-2">
                                        {example.image ? (
                                            <img
                                                src={example.image}
                                                alt={example.title}
                                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500" />
                                        )}
                                        {/* Template Badge */}
                                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                            <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-900 dark:text-white px-2 py-1 rounded text-[10px] sm:text-xs font-medium shadow-sm">
                                                {example.templateName}
                                            </span>
                                        </div>
                                        {/* Hover Overlay - hidden on mobile */}
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300 hidden sm:flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                                    Create Similar
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-1">
                                            {example.title}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {example.items.slice(0, 2).map(i => i.name).join(", ")}
                                                {example.items.length > 2 &&
                                                    ` +${example.items.length - 2} more`}
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <ShoppingCart className="w-3 h-3" />
                                                    {example.itemCount} items
                                                </span>
                                                <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                                                    {example.totalFormatted}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* No results message */}
            {filteredExamples.length === 0 && searchQuery && (
                <div className="text-center py-8 sm:py-12">
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        No examples found for &quot;{searchQuery}&quot;
                    </p>
                </div>
            )}
        </>
    );
}
