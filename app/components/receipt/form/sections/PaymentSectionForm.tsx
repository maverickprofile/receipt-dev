"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DividerConfig from "./DividerConfig";
import type { PaymentSection, PaymentMethod, PaymentLine } from "@/lib/receipt-schemas";

interface PaymentSectionFormProps {
  value: PaymentSection;
  onChange: (updates: Partial<PaymentSection>) => void;
}

const DEFAULT_CASH_LINES: PaymentLine[] = [
  { title: "Cash", value: "20.00" },
  { title: "Change", value: "3.45" },
];

const DEFAULT_CARD_LINES: PaymentLine[] = [
  { title: "Card number", value: "**** **** **** 4922" },
  { title: "Card type", value: "Debit" },
  { title: "Card entry", value: "Chip" },
  { title: "Date/time", value: "11/20/2019 11:09 AM" },
  { title: "Reference #", value: "62845289260246240685C" },
  { title: "Status", value: "APPROVED" },
];

export default function PaymentSectionForm({ value, onChange }: PaymentSectionFormProps) {
  const isCash = value.method === "Cash";
  const customLines = value.customLines || [];

  const handleModeChange = (mode: "Cash" | "Card") => {
    if (mode === "Cash") {
      onChange({
        method: "Cash",
        customLines: DEFAULT_CASH_LINES,
      });
    } else {
      onChange({
        method: "Credit Card",
        customLines: DEFAULT_CARD_LINES,
      });
    }
  };

  const updateLine = (index: number, field: keyof PaymentLine, newValue: string) => {
    const newLines = [...customLines];
    newLines[index] = { ...newLines[index], [field]: newValue };
    onChange({ customLines: newLines });
  };

  const addLine = () => {
    onChange({
      customLines: [...customLines, { title: "", value: "" }],
    });
  };

  const removeLine = (index: number) => {
    const newLines = customLines.filter((_, i) => i !== index);
    onChange({ customLines: newLines });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Method Tabs */}
      <div className="flex p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => handleModeChange("Cash")}
          className={cn(
            "flex-1 text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-3 rounded-md transition-all",
            isCash
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          Cash
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("Card")}
          className={cn(
            "flex-1 text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-3 rounded-md transition-all",
            !isCash
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          Card
        </button>
      </div>

      {/* Dynamic Lines (Title | Value) */}
      <div className="space-y-2 sm:space-y-3">
        {/* Headers - hidden on mobile */}
        <div className="hidden sm:flex gap-2 px-1">
          <Label className="flex-1 text-muted-foreground text-xs uppercase">Title</Label>
          <Label className="flex-1 text-muted-foreground text-xs uppercase">Value</Label>
          <div className="w-8" /> {/* Spacer for delete button */}
        </div>

        {customLines.map((line, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 p-2 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none bg-muted/30 sm:bg-transparent">
            {/* Mobile: Label for Title */}
            <div className="flex gap-2 items-center">
              <div className="sm:hidden text-xs text-muted-foreground w-12">Title</div>
              <Input
                value={line.title}
                onChange={(e) => updateLine(index, "title", e.target.value)}
                className="flex-1 bg-background h-9 sm:h-10 text-sm"
                placeholder="Label"
              />
            </div>
            {/* Mobile: Label for Value + Delete */}
            <div className="flex gap-2 items-center">
              <div className="sm:hidden text-xs text-muted-foreground w-12">Value</div>
              <Input
                value={line.value}
                onChange={(e) => updateLine(index, "value", e.target.value)}
                className="flex-1 bg-background h-9 sm:h-10 text-sm"
                placeholder="Value"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeLine(index)}
                className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-transparent sm:border-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          className="w-full h-9 sm:h-10 text-xs sm:text-sm text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border border-primary/20"
          onClick={addLine}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add line
        </Button>
      </div>

      {/* Divider */}
      <DividerConfig
        value={value.divider}
        onChange={(divider) => onChange({ divider })}
      />
    </div>
  );
}

