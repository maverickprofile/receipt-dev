"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AlignmentSelector from "./AlignmentSelector";
import DividerConfig from "./DividerConfig";
import type { DateTimeSection } from "@/lib/receipt-schemas";

interface DateTimeSectionFormProps {
  value: DateTimeSection;
  onChange: (updates: Partial<DateTimeSection>) => void;
}

export default function DateTimeSectionForm({ value, onChange }: DateTimeSectionFormProps) {
  // Convert ISO string to datetime-local format
  const dateTimeLocalValue = value.dateTime
    ? new Date(value.dateTime).toISOString().slice(0, 16)
    : "";

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onChange({ dateTime: newDate.toISOString() });
  };

  return (
    <div className="space-y-4">
      {/* Alignment */}
      <AlignmentSelector
        value={value.alignment}
        onChange={(alignment) => onChange({ alignment })}
      />

      {/* Date & Time */}
      <div className="space-y-2">
        <Label htmlFor="datetime">Date & Time</Label>
        <Input
          id="datetime"
          type="datetime-local"
          value={dateTimeLocalValue}
          onChange={handleDateTimeChange}
        />
      </div>

      {/* Divider */}
      <DividerConfig
        value={value.divider}
        onChange={(divider) => onChange({ divider })}
      />
    </div>
  );
}

