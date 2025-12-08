"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AlignmentSelector from "./AlignmentSelector";
import DividerConfig from "./DividerConfig";
import type { CustomMessageSection } from "@/lib/receipt-schemas";

interface CustomMessageSectionFormProps {
  value: CustomMessageSection;
  onChange: (updates: Partial<CustomMessageSection>) => void;
}

export default function CustomMessageSectionForm({
  value,
  onChange,
}: CustomMessageSectionFormProps) {
  return (
    <div className="space-y-4">
      {/* Alignment */}
      <AlignmentSelector
        value={value.alignment}
        onChange={(alignment) => onChange({ alignment })}
      />

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={value.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Enter your custom message..."
          rows={4}
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

