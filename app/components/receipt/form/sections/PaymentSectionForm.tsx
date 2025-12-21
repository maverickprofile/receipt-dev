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
    const newLines = [...value.customLines];
    newLines[index] = { ...newLines[index], [field]: newValue };
    onChange({ customLines: newLines });
  };

  const addLine = () => {
    onChange({
      customLines: [...value.customLines, { title: "", value: "" }],
    });
  };

  const removeLine = (index: number) => {
    const newLines = value.customLines.filter((_, i) => i !== index);
    onChange({ customLines: newLines });
  };

  return (
    <div className="space-y-4">
      {/* Method Tabs */}
      <div className="flex p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => handleModeChange("Cash")}
          className={cn(
            "flex-1 text-sm font-medium py-1.5 px-3 rounded-md transition-all",
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
            "flex-1 text-sm font-medium py-1.5 px-3 rounded-md transition-all",
            !isCash
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          Card
        </button>
      </div>

      {/* Dynamic Lines (Title | Value) */}
      <div className="space-y-3">
        <div className="flex gap-2 px-1">
          <Label className="flex-1 text-muted-foreground text-xs uppercase">Title</Label>
          <Label className="flex-1 text-muted-foreground text-xs uppercase">Value</Label>
          <div className="w-8" /> {/* Spacer for delete button */}
        </div>

        {value.customLines.map((line, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={line.title}
              onChange={(e) => updateLine(index, "title", e.target.value)}
              className="flex-1"
              placeholder="Label"
            />
            <Input
              value={line.value}
              onChange={(e) => updateLine(index, "value", e.target.value)}
              className="flex-1"
              placeholder="Value"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeLine(index)}
              className="h-10 w-10 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          className="w-full text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border border-primary/20"
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

