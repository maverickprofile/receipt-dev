"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import AlignmentSelector from "./AlignmentSelector";
import DividerConfig from "./DividerConfig";
import type { HeaderSection } from "@/lib/receipt-schemas";

interface HeaderSectionFormProps {
  value: HeaderSection;
  onChange: (updates: Partial<HeaderSection>) => void;
}

export default function HeaderSectionForm({ value, onChange }: HeaderSectionFormProps) {
  return (
    <div className="space-y-4">
      {/* Alignment */}
      <AlignmentSelector
        value={value.alignment}
        onChange={(alignment) => onChange({ alignment })}
      />

      {/* Logo URL */}
      <div className="space-y-2">
        <Label htmlFor="logo-url">Logo URL</Label>
        <Input
          id="logo-url"
          value={value.logo.url}
          onChange={(e) => onChange({ logo: { ...value.logo, url: e.target.value } })}
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Logo Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Logo Size</Label>
          <span className="text-sm text-muted-foreground">{value.logo.size}%</span>
        </div>
        <Slider
          value={[value.logo.size]}
          onValueChange={([size]) => onChange({ logo: { ...value.logo, size } })}
          min={0}
          max={100}
          step={5}
        />
      </div>

      {/* Business Details */}
      <div className="space-y-2">
        <Label htmlFor="business-details">Business Details</Label>
        <Textarea
          id="business-details"
          value={value.businessDetails}
          onChange={(e) => onChange({ businessDetails: e.target.value })}
          placeholder="Business Name&#10;Address Line 1&#10;Address Line 2"
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

