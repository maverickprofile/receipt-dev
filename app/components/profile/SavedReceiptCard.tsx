"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, MoreVertical, Pencil, Trash2, Calendar } from "lucide-react";

interface SavedReceiptRecord {
    id: string;
    name: string;
    template_id: string | null;
    receipt_data: any;
    created_at: string;
    updated_at: string;
}

interface SavedReceiptCardProps {
    receipt: SavedReceiptRecord;
    onDelete: (id: string) => void;
}

export default function SavedReceiptCard({ receipt, onDelete }: SavedReceiptCardProps) {
    const params = useParams();
    const locale = (params.locale as string) || "en";
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/user-receipts/${receipt.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onDelete(receipt.id);
            }
        } catch (error) {
            console.error("Error deleting receipt:", error);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    // Generate edit link - use template_id if available, otherwise use receipt id
    const editLink = receipt.template_id
        ? `/${locale}/generate/${receipt.template_id}`
        : `/${locale}/generate`;

    return (
        <>
            <Card className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        {/* Icon and Info */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm sm:text-base truncate">
                                    {receipt.name || "Untitled Receipt"}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(receipt.updated_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={editLink} className="flex items-center cursor-pointer">
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Quick Edit Button */}
                    <Link href={editLink}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 text-xs"
                        >
                            <Pencil className="h-3 w-3 mr-1.5" />
                            Open & Edit
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{receipt.name || "Untitled Receipt"}"?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
