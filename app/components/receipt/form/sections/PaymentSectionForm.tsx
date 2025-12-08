"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DividerConfig from "./DividerConfig";
import type { PaymentSection, PaymentType, PaymentLine } from "@/lib/receipt-schemas";

interface PaymentSectionFormProps {
  value: PaymentSection;
  onChange: (updates: Partial<PaymentSection>) => void;
}

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
];

export default function PaymentSectionForm({ value, onChange }: PaymentSectionFormProps) {
  const updateLine = (index: number, field: keyof PaymentLine, newValue: string) => {
    const newLines = [...value.lines];
    newLines[index] = { ...newLines[index], [field]: newValue };
    onChange({ lines: newLines });
  };

  const addLine = () => {
    onChange({
      lines: [...value.lines, { title: "", value: "" }],
    });
  };

  const removeLine = (index: number) => {
    const newLines = value.lines.filter((_, i) => i !== index);
    onChange({ lines: newLines.length ? newLines : [{ title: "", value: "" }] });
  };

  return (
    <div className="space-y-4">
      {/* Payment Type */}
      <div className="space-y-2">
        <Label>Payment Type</Label>
        <Select
          value={value.paymentType}
          onValueChange={(val: PaymentType) => onChange({ paymentType: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Lines */}
      <div className="space-y-3">
        <Label>Payment Details</Label>
        {value.lines.map((line, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Label (e.g., Card number)"
              value={line.title}
              onChange={(e) => updateLine(index, "title", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={line.value}
              onChange={(e) => updateLine(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeLine(index)}
              disabled={value.lines.length === 1}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLine}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Line
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

