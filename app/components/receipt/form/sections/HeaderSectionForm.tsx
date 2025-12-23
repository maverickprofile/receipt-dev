"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Link, ImageIcon } from "lucide-react";
import AlignmentSelector from "./AlignmentSelector";
import DividerConfig from "./DividerConfig";
import type { HeaderSection } from "@/lib/receipt-schemas";

interface HeaderSectionFormProps {
  value: HeaderSection;
  onChange: (updates: Partial<HeaderSection>) => void;
}

export default function HeaderSectionForm({ value, onChange }: HeaderSectionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoInputMode, setLogoInputMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");

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

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange({ logoUrl: urlInput.trim(), showLogo: true });
      setUrlInput("");
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

        {/* Logo Size (Only visible if logo enabled) */}
        <div className={`flex-1 space-y-2 transition-opacity ${value.showLogo ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Logo Size</Label>
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

      {/* Logo Section */}
      <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Logo</Label>
          <div className="flex items-center gap-1">
            <Switch
              checked={value.showLogo}
              onCheckedChange={(showLogo) => onChange({ showLogo })}
            />
            <span className="text-xs text-muted-foreground ml-1">
              {value.showLogo ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {value.showLogo && (
          <>
            {/* Current Logo Preview */}
            {value.logoUrl && (
              <div className="flex items-center gap-3 p-2 bg-background rounded border">
                <img
                  src={value.logoUrl}
                  alt="Logo"
                  className="h-12 w-auto max-w-[100px] object-contain"
                />
                <div className="flex-1 text-xs text-muted-foreground truncate">
                  {value.logoUrl.startsWith("data:") ? "Uploaded image" : value.logoUrl}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onChange({ logoUrl: "" })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Logo Input Options */}
            {!value.logoUrl && (
              <div className="space-y-3">
                {/* Mode Toggle */}
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLogoInputMode("upload")}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-md transition-all ${
                      logoInputMode === "upload"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoInputMode("url")}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-md transition-all ${
                      logoInputMode === "url"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50"
                    }`}
                  >
                    <Link className="h-3.5 w-3.5" />
                    URL
                  </button>
                </div>

                {/* Upload Mode */}
                {logoInputMode === "upload" && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</span>
                  </div>
                )}

                {/* URL Mode */}
                {logoInputMode === "url" && (
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                    />
                    <Button
                      type="button"
                      onClick={handleUrlSubmit}
                      disabled={!urlInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        )}
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

