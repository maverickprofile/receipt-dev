"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import AlignmentSelector from "./AlignmentSelector";
import DividerConfig from "./DividerConfig";
import type { HeaderSection } from "@/lib/receipt-schemas";

interface HeaderSectionFormProps {
  value: HeaderSection;
  onChange: (updates: Partial<HeaderSection>) => void;
}

export default function HeaderSectionForm({ value, onChange }: HeaderSectionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logoUrl: reader.result as string, showLogo: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Row: Alignment | Logo | Size */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Alignment */}
        <div className="flex-1 space-y-2">
          <Label className="text-xs text-muted-foreground">Alignment</Label>
          <AlignmentSelector
            value={value.alignment}
            onChange={(alignment) => onChange({ alignment })}
          />
        </div>

        {/* Logo Toggle & Upload */}
        <div className="space-y-2 flex flex-col items-center">
          <Label className="text-xs text-muted-foreground w-full text-center sm:text-left">Logo</Label>
          <div className="flex items-center gap-2 h-10">
            {value.showLogo && value.logoUrl ? (
              <div className="relative group">
                <img
                  src={value.logoUrl}
                  alt="Logo"
                  className="h-9 w-auto max-w-[80px] object-contain border rounded bg-white p-0.5"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-4 w-4 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-0"
                  onClick={() => onChange({ logoUrl: "" })}
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className={value.showLogo ? "h-9 px-3" : "h-9 px-3 text-muted-foreground"}
              >
                {value.showLogo ? <Upload className="h-4 w-4" /> : "No Logo"}
              </Button>
            )}

            {!value.showLogo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ showLogo: true })}
                className="h-9 px-2 text-xs"
              >
                Show
              </Button>
            )}

            {value.showLogo && !value.logoUrl && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange({ showLogo: false })}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Logo Size (Only visible if logo enabled) */}
        <div className={`flex-1 space-y-2 transition-opacity ${value.showLogo ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Size</Label>
          </div>
          <div className="flex items-center h-10">
            <Slider
              value={[value.logoWidth || 100]}
              onValueChange={([logoWidth]) => onChange({ logoWidth })}
              min={20}
              max={150}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Business Details Group */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Business Name</Label>
          <Input
            value={value.businessName}
            onChange={(e) => onChange({ businessName: e.target.value })}
            placeholder="Business Name"
            className="bg-background font-bold"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Business Details</Label>
          <Textarea
            value={value.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder={`Computed Address
Phone: (555) 123-4567
www.example.com
Store #: 1234`}
            rows={6}
            className="bg-background resize-none font-mono text-xs"
          />
          <p className="text-[10px] text-muted-foreground">
            Enter address, phone, website, and other details here. They will appear as written.
          </p>
        </div>
      </div>

      {/* Divider Config */}
      <div className="pt-2 border-t">
        <DividerConfig
          value={value.divider}
          onChange={(divider) => onChange({ divider })}
        />
      </div>
    </div>
  );
}

