"use client";

import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReceiptContext } from "@/contexts/ReceiptContext";
import { SettingsSection } from "./form/sections";
import SortableSectionList from "./form/SortableSectionList";
import { RECEIPT_SECTION_TYPES } from "@/lib/variables";
import type { SectionType } from "@/lib/receipt-schemas";
import {
  Layout,
  Calendar,
  MessageSquare,
  Info,
  ShoppingCart,
  CreditCard,
  ScanLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Layout,
  Calendar,
  MessageSquare,
  Info,
  ShoppingCart,
  CreditCard,
  ScanLine,
};

export default function ReceiptForm() {
  const { receipt, updateSettings, addSection, isLoading } = useReceiptContext();

  const handleAddSection = (type: SectionType) => {
    addSection(type);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!receipt) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center text-muted-foreground">
          No template loaded. Please select a template to begin.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Receipt Name Header */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{receipt.name}</CardTitle>
        </CardHeader>
      </Card>

      {/* Settings Section (Fixed, not draggable) */}
      <SettingsSection value={receipt.settings} onChange={updateSettings} />

      {/* Sortable Sections */}
      <SortableSectionList />

      {/* Add Section Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          {RECEIPT_SECTION_TYPES.map((section) => {
            const Icon = iconMap[section.icon];
            return (
              <DropdownMenuItem
                key={section.value}
                onClick={() => handleAddSection(section.value as SectionType)}
                className="cursor-pointer"
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {section.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

