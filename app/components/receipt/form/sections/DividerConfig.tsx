"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DividerConfig as DividerConfigType, DividerStyle } from "@/lib/receipt-schemas";

interface DividerConfigProps {
  value: DividerConfigType;
  onChange: (value: DividerConfigType) => void;
  label?: string;
}

const DIVIDER_STYLES: { value: DividerStyle; label: string }[] = [
  { value: "---", label: "Dashes (---)" },
  { value: "===", label: "Equals (===)" },
  { value: "...", label: "Dots (...)" },
  { value: ":::", label: "Colons (:::)" },
  { value: "***", label: "Stars (***)" },
  { value: "blank", label: "Blank line" },
];

export default function DividerConfigComponent({
  value,
  onChange,
  label = "Divider",
}: DividerConfigProps) {
  const handleEnabledChange = (enabled: boolean) => {
    onChange({ ...value, enabled });
  };

  const handleStyleChange = (style: DividerStyle) => {
    onChange({ ...value, style });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Switch checked={value.enabled} onCheckedChange={handleEnabledChange} />
      </div>

      {value.enabled && (
        <Select value={value.style} onValueChange={handleStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {DIVIDER_STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

