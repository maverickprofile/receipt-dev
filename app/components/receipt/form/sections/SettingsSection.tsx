"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import type {
  SettingsSection as SettingsSectionType,
  CurrencyFormat,
  FontStyle,
  BackgroundStyle,
} from "@/lib/receipt-schemas";

interface SettingsSectionProps {
  value: SettingsSectionType;
  onChange: (value: Partial<SettingsSectionType>) => void;
}

const CURRENCY_FORMATS: { value: CurrencyFormat; label: string }[] = [
  { value: "prefix", label: "Prefix ($10)" },
  { value: "suffix", label: "Suffix (10$)" },
  { value: "suffix_space", label: "Suffix with space (10 $)" },
];

const FONTS: { value: FontStyle; label: string }[] = [
  { value: "font1", label: "Roboto Mono" },
  { value: "font2", label: "Space Mono" },
  { value: "font3", label: "Inconsolata" },
];

const BACKGROUND_STYLES: { value: BackgroundStyle; label: string }[] = [
  { value: "1", label: "Style 1" },
  { value: "2", label: "Style 2" },
  { value: "3", label: "Style 3" },
  { value: "4", label: "Style 4" },
  { value: "5", label: "Style 5" },
];

export default function SettingsSection({ value, onChange }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currency Symbol */}
        <div className="space-y-2">
          <Label htmlFor="currency">Currency Symbol</Label>
          <Input
            id="currency"
            value={value.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            placeholder="$"
            className="w-20"
          />
        </div>

        {/* Currency Format */}
        <div className="space-y-2">
          <Label>Currency Format</Label>
          <Select
            value={value.currencyFormat}
            onValueChange={(val: CurrencyFormat) => onChange({ currencyFormat: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_FORMATS.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font */}
        <div className="space-y-2">
          <Label>Font</Label>
          <Select
            value={value.font}
            onValueChange={(val: FontStyle) => onChange({ font: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="textColor"
              type="color"
              value={value.textColor}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              value={value.textColor}
              onChange={(e) => onChange({ textColor: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        {/* Show Background */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show receipt background</Label>
            <Switch
              checked={value.showBackground.enabled}
              onCheckedChange={(enabled) =>
                onChange({
                  showBackground: { ...value.showBackground, enabled },
                })
              }
            />
          </div>

          {value.showBackground.enabled && (
            <Select
              value={value.showBackground.style}
              onValueChange={(val: BackgroundStyle) =>
                onChange({
                  showBackground: { ...value.showBackground, style: val },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUND_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

