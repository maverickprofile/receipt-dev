"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DividerConfig from "./DividerConfig";
import type { BarcodeSection, BarcodeCodeType } from "@/lib/receipt-schemas";

interface BarcodeSectionFormProps {
  value: BarcodeSection;
  onChange: (updates: Partial<BarcodeSection>) => void;
}

const BARCODE_TYPES: { value: BarcodeCodeType; label: string }[] = [
  { value: "CODE128", label: "CODE128" },
  { value: "EAN13", label: "EAN13" },
  { value: "UPC_A", label: "UPC-A" },
  { value: "QR_CODE", label: "QR Code" },
];

export default function BarcodeSectionForm({ value, onChange }: BarcodeSectionFormProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Title is handled by parent, we just render content */}

      {/* Barcode Value Input Removed as per user request */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Size (Height) */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs sm:text-sm">Size</Label>
            <span className="text-xs text-muted-foreground">{value.height}</span>
          </div>
          <Slider
            value={[value.height]}
            onValueChange={([height]) => onChange({ height })}
            min={20}
            max={100}
            step={5}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>

        {/* Length (Width/Scale) */}
        {/* Note: react-barcode uses 'width' as bar width (1, 2, 3...).
            But our schema has 'width' as pixel width for the container.
            We will map 'width' slider to a scale factor or keep it as container width.
            For simple matching of "Length" slider, we'll map it to 'width' 100-300px roughly.
        */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between">
            <Label className="text-xs sm:text-sm">Length</Label>
            <span className="text-xs text-muted-foreground">{value.width || "Auto"}</span>
          </div>
          <Slider
            value={[value.width || 150]}
            onValueChange={([width]) => onChange({ width })}
            min={100}
            max={300}
            step={10}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="pt-2">
        <DividerConfig
          value={value.divider}
          onChange={(divider) => onChange({ divider })}
          label="Divider at the bottom"
        />
      </div>
    </div>
  );
}

