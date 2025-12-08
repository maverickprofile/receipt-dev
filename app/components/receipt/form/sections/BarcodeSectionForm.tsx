"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import DividerConfig from "./DividerConfig";
import type { BarcodeSection } from "@/lib/receipt-schemas";

interface BarcodeSectionFormProps {
  value: BarcodeSection;
  onChange: (updates: Partial<BarcodeSection>) => void;
}

export default function BarcodeSectionForm({ value, onChange }: BarcodeSectionFormProps) {
  return (
    <div className="space-y-4">
      {/* Barcode Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Size</Label>
          <span className="text-sm text-muted-foreground">{value.size}%</span>
        </div>
        <Slider
          value={[value.size]}
          onValueChange={([size]) => onChange({ size })}
          min={20}
          max={100}
          step={5}
        />
      </div>

      {/* Barcode Length */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Length</Label>
          <span className="text-sm text-muted-foreground">{value.length}%</span>
        </div>
        <Slider
          value={[value.length]}
          onValueChange={([length]) => onChange({ length })}
          min={50}
          max={100}
          step={5}
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

