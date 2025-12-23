import { Pool } from "pg";

/**
 * Shared database connection pool
 * Used by API routes for database operations
 */
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Generate a unique ID with a prefix
 * Format: {prefix}_{timestamp}_{random}
 */
export function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Types for saved receipts
 */
export interface SavedReceiptRecord {
    id: string;
    user_id: string;
    name: string;
    template_id: string | null;
    receipt_data: any; // ReceiptType JSON
    created_at: string;
    updated_at: string;
}

/**
 * Types for download history
 */
export interface DownloadHistoryRecord {
    id: string;
    user_id: string;
    receipt_id: string | null;
    template_id: string | null;
    template_name: string | null;
    download_type: "pdf" | "image";
    downloaded_at: string;
}
