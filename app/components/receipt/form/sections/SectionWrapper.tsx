"use client";

import { useState } from "react";
import { ChevronDown, GripVertical, X, Copy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SectionType } from "@/lib/receipt-schemas";

// Icons mapping for section types
import {
  Layout,
  Calendar,
  MessageSquare,
  Info,
  ShoppingCart,
  CreditCard,
  ScanLine,
} from "lucide-react";

const sectionIcons: Record<SectionType, React.ComponentType<{ className?: string }>> = {
  header: Layout,
  datetime: Calendar,
  custom_message: MessageSquare,
  two_column: Info,
  items_list: ShoppingCart,
  payment: CreditCard,
  barcode: ScanLine,
};

const sectionLabels: Record<SectionType, string> = {
  header: "Header",
  datetime: "Date & Time",
  custom_message: "Custom message",
  two_column: "Two column information",
  items_list: "Items list",
  payment: "Payment",
  barcode: "Barcode",
};

interface SectionWrapperProps {
  sectionId: string;
  sectionType: SectionType;
  children: React.ReactNode;
  onRemove: () => void;
  onDuplicate?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  defaultOpen?: boolean;
}

export default function SectionWrapper({
  sectionId,
  sectionType,
  children,
  onRemove,
  onDuplicate,
  dragHandleProps,
  isDragging = false,
  defaultOpen = true,
}: SectionWrapperProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = sectionIcons[sectionType] || FileText;
  const label = sectionLabels[sectionType] || "Unknown Section";

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary"
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-3 sm:p-4 pb-0">
          <div className="flex items-center justify-between gap-2">
            {/* Left side: Icon, Label, Chevron */}
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity min-w-0"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                <span className="font-semibold text-sm sm:text-base truncate">{label}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </CollapsibleTrigger>

            {/* Right side: Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {/* Duplicate button */}
              {onDuplicate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onDuplicate}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                  aria-label="Duplicate section"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}

              {/* Drag handle */}
              <button
                type="button"
                className={cn(
                  "h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-md",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  "cursor-grab active:cursor-grabbing",
                  "transition-colors"
                )}
                aria-label="Drag to reorder"
                {...dragHandleProps}
              >
                <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Remove section"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="p-3 sm:p-4 pt-3 sm:pt-4">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

