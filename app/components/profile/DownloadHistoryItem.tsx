"use client";

import { FileText, FileImage, Download, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DownloadRecord {
    id: string;
    receipt_id: string | null;
    template_id: string | null;
    template_name: string | null;
    download_type: "pdf" | "image";
    downloaded_at: string;
}

interface DownloadHistoryItemProps {
    download: DownloadRecord;
}

export default function DownloadHistoryItem({ download }: DownloadHistoryItemProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const isPdf = download.download_type === "pdf";

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            {/* Icon */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isPdf
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-green-100 dark:bg-green-900/30"
            }`}>
                {isPdf ? (
                    <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                ) : (
                    <FileImage className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                        {download.template_name || "Untitled Receipt"}
                    </span>
                    <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${
                            isPdf
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                    >
                        {isPdf ? "PDF" : "PNG"}
                    </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(download.downloaded_at)}</span>
                </div>
            </div>

            {/* Download Icon (visual indicator) */}
            <Download className="w-4 h-4 text-muted-foreground" />
        </div>
    );
}
