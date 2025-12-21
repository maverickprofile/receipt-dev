"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DividerConfig as DividerConfigType, DividerStyle } from "@/lib/receipt-schemas";

interface DividerConfigProps {
  value: DividerConfigType;
  onChange: (value: DividerConfigType) => void;
  label?: string;
}

const DIVIDER_STYLES: { value: DividerStyle; label: string }[] = [
  { value: "---", label: "---" },
  { value: "===", label: "===" },
  { value: "...", label: "..." },
  { value: ":::", label: ":::" },
  { value: "***", label: "***" },
  { value: "blank", label: "\u00A0" },
];

export default function DividerConfigComponent({
  value,
  onChange,
  label = "Divider at the bottom",
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
        <div className="flex gap-2">
          {DIVIDER_STYLES.map((style) => (
            <Button
              key={style.value}
              type="button"
              variant={value.style === style.value ? "default" : "outline"}
              onClick={() => handleStyleChange(style.value)}
              className={cn(
                "flex-1 font-mono",
                value.style === style.value && "bg-primary text-primary-foreground"
              )}
            >
              {style.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

