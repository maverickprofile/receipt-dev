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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {filteredExamples.map((example) => {
                    const exampleSlug = generateExampleSlug(example.templateName, example.items, example.total);
                    return (
                        <Link
                            key={example.id}
                            href={`/${locale}/example/${exampleSlug}`}
                            className="group"
                        >
                            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer border-0 bg-sky-100 dark:bg-slate-800 rounded-xl">
                                <CardContent className="p-0">
                                    {/* Thumbnail Container - clips the receipt */}
                                    <div className="aspect-[4/5] overflow-hidden relative flex justify-center pt-4 px-3">
                                        {example.image ? (
                                            <div className="relative w-[85%] h-[140%]">
                                                <img
                                                    src={example.image}
                                                    alt={example.title}
                                                    className="w-full h-auto object-contain object-top shadow-lg rounded-sm transition-transform duration-300 group-hover:scale-[1.02]"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-[85%] h-full bg-white dark:bg-gray-700 rounded-sm shadow-lg flex items-center justify-center">
                                                <Receipt className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}
                                        {/* Hover Overlay - hidden on mobile */}
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 hidden sm:flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                                                    Create Similar
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Name */}
                                    <div className="p-2 sm:p-3 text-center bg-sky-100 dark:bg-slate-800">
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {example.templateName} Receipt
                                        </h3>
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
