"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  SettingsSection as SettingsSectionType,
  CurrencyFormat,
  FontStyle,
} from "@/lib/receipt-schemas";

interface SettingsSectionProps {
  value: SettingsSectionType;
  onChange: (value: Partial<SettingsSectionType>) => void;
}

const CURRENCY_FORMATS: { value: CurrencyFormat; label: string }[] = [
  { value: "prefix", label: "$2.99" },
  { value: "suffix", label: "2.99$" },
  { value: "suffix_space", label: "2.99 $" },
];

const FONTS: { value: FontStyle; label: string }[] = [
  { value: "font1", label: "Font 1" },
  { value: "font2", label: "Font 2" },
  { value: "font3", label: "Font 3" },
  { value: "hypermarket", label: "Hypermarket" },
  { value: "ocr-b", label: "OCR-B" },
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
      <CardContent className="space-y-6">
        {/* Currency & Format in one row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Currency Symbol */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={value.currency}
              onChange={(e) => onChange({ currency: e.target.value })}
              placeholder="$"
              className="w-20"
            />
          </div>

          {/* Currency Format - Button Group */}
          <div className="space-y-2">
            <Label>Format</Label>
            <div className="flex gap-2">
              {CURRENCY_FORMATS.map((format) => (
                <Button
                  key={format.value}
                  type="button"
                  variant={value.currencyFormat === format.value ? "default" : "outline"}
                  onClick={() => onChange({ currencyFormat: format.value })}
                  className={cn(
                    "flex-1",
                    value.currencyFormat === format.value && "bg-primary text-primary-foreground"
                  )}
                >
                  {format.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Font - Button Group */}
        <div className="space-y-2">
          <Label>Font</Label>
          <div className="flex gap-2">
            {FONTS.map((font) => (
              <Button
                key={font.value}
                type="button"
                variant={value.font === font.value ? "default" : "outline"}
                onClick={() => onChange({ font: font.value })}
                className={cn(
                  "flex-1",
                  value.font === font.value && "bg-primary text-primary-foreground"
                )}
              >
                {font.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label htmlFor="textColor">Text color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="textColor"
              type="color"
              value={value.textColor}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">{value.textColor}</span>
          </div>
        </div>

        {/* Show Background - Toggle with Style Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Show receipt background</Label>
            <Switch
              checked={value.showBackground.enabled}
              onCheckedChange={(enabled) =>
                onChange({
                  showBackground: { ...value.showBackground, enabled },
                })
              }
            />
          </div>

          {/* Background Style Buttons (when enabled) */}
          {value.showBackground.enabled && (
            <div className="flex gap-2">
              {["1", "2", "3", "4", "5"].map((style) => (
                <Button
                  key={style}
                  type="button"
                  variant={value.showBackground.style === style ? "default" : "outline"}
                  onClick={() =>
                    onChange({
                      showBackground: { ...value.showBackground, style: style as any },
                    })
                  }
                  className={cn(
                    "flex-1",
                    value.showBackground.style === style && "bg-primary text-primary-foreground"
                  )}
                >
                  #{style}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

