"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DividerConfig from "./DividerConfig";
import type {
  ItemsListSection,
  ReceiptItem,
  TotalLine,
  TotalSizePercentage,
} from "@/lib/receipt-schemas";

interface ItemsListSectionFormProps {
  value: ItemsListSection;
  onChange: (updates: Partial<ItemsListSection>) => void;
}

const TOTAL_SIZE_OPTIONS: { value: TotalSizePercentage; label: string }[] = [
  { value: "+10%", label: "+10%" },
  { value: "+20%", label: "+20%" },
  { value: "+50%", label: "+50%" },
  { value: "+75%", label: "+75%" },
  { value: "+100%", label: "+100%" },
];

export default function ItemsListSectionForm({
  value,
  onChange,
}: ItemsListSectionFormProps) {
  // Auto-calculation helper
  const calculateUpdates = (
    currentItems: typeof value.items,
    currentTotalLines: TotalLine[]
  ) => {
    // 1. Calculate Subtotal from items
    const subtotal = currentItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // 2. Update "Subtotal" line if it exists
    const newTotalLines = currentTotalLines.map((line) => {
      if (line.title.toLowerCase() === "subtotal") {
        return { ...line, value: subtotal };
      }
      return line;
    });

    // 3. Calculate Grand Total (Sum of all total lines)
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);

    const currentTotal = value.total ?? { title: "Total", value: 0 };
    return {
      totalLines: newTotalLines,
      total: { title: currentTotal.title, value: grandTotal },
    };
  };

  // Items handlers
  const updateItem = (index: number, field: keyof ReceiptItem, newValue: string | number) => {
    const newItems = [...value.items];
    newItems[index] = { ...newItems[index], [field]: newValue };

    const totalLines = value.totalLines ?? [];
    const updates = calculateUpdates(newItems, totalLines);
    onChange({ items: newItems, ...updates });
  };

  const addItem = () => {
    const newItems = [...value.items, { quantity: 1, name: "", price: 0 }];
    const totalLines = value.totalLines ?? [];
    const updates = calculateUpdates(newItems, totalLines);
    onChange({ items: newItems, ...updates });
  };

  const removeItem = (index: number) => {
    const newItems = value.items.filter((_, i) => i !== index);
    const finalItems = newItems.length ? newItems : [{ quantity: 1, name: "", price: 0 }];
    const totalLines = value.totalLines ?? [];
    const updates = calculateUpdates(finalItems, totalLines);
    onChange({ items: finalItems, ...updates });
  };

  // Total lines handlers
  const updateTotalLine = (index: number, field: keyof TotalLine, newValue: string | number) => {
    const totalLines = value.totalLines ?? [];
    const newTotalLines = [...totalLines];
    newTotalLines[index] = { ...newTotalLines[index], [field]: newValue };

    // Recalculate Grand Total only
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);
    const currentTotal = value.total ?? { title: "Total", value: 0 };

    onChange({
      totalLines: newTotalLines,
      total: { title: currentTotal.title, value: grandTotal }
    });
  };

  const addTotalLine = () => {
    const totalLines = value.totalLines ?? [];
    const newTotalLines = [...totalLines, { title: "", value: 0 }];
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);
    const currentTotal = value.total ?? { title: "Total", value: 0 };
    onChange({ totalLines: newTotalLines, total: { title: currentTotal.title, value: grandTotal } });
  };

  const removeTotalLine = (index: number) => {
    const totalLines = value.totalLines ?? [];
    const newTotalLines = totalLines.filter((_, i) => i !== index);
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);
    const currentTotal = value.total ?? { title: "Total", value: 0 };
    onChange({ totalLines: newTotalLines, total: { title: currentTotal.title, value: grandTotal } });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Items */}
      <div className="space-y-2">
        {/* Headers - hidden on mobile */}
        <div className="hidden sm:flex gap-2 text-xs font-semibold text-muted-foreground px-1">
          <div className="w-14 sm:w-16">Qty</div>
          <div className="flex-1">Item</div>
          <div className="w-20 sm:w-24">Price</div>
          <div className="w-8"></div>
        </div>

        {value.items.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 p-2 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none bg-muted/30 sm:bg-transparent">
            {/* Mobile: Labels + row layout */}
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <div className="sm:hidden text-xs text-muted-foreground w-8">Qty</div>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                className="w-14 sm:w-16 bg-background text-center h-9 sm:h-10 text-sm"
                min={1}
              />
              <div className="sm:hidden flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  placeholder="Item name"
                  className="bg-background h-9 text-sm"
                />
              </div>
            </div>
            {/* Desktop: Item name */}
            <Input
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              placeholder="Item name"
              className="hidden sm:flex flex-1 bg-background h-10"
            />
            {/* Price + Delete */}
            <div className="flex gap-2 items-center">
              <div className="sm:hidden text-xs text-muted-foreground w-8">Price</div>
              <Input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                className="w-20 sm:w-24 bg-background text-right h-9 sm:h-10 text-sm"
                step="0.01"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={value.items.length === 1}
                className="h-9 w-9 sm:h-10 sm:w-8 text-destructive border-transparent hover:bg-destructive/10 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full text-primary border-primary/20 hover:bg-primary/5 hover:text-primary h-9 sm:h-10 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add line
        </Button>
      </div>

      {/* Items Divider */}
      <div className="pt-2">
        <DividerConfig
          value={value.divider}
          onChange={(divider) => onChange({ divider })}
          label="Divider"
        />
      </div>

      {/* Total Lines (Subtotals, Tax, etc.) */}
      <div className="space-y-2">
        <Label className="text-xs sm:text-sm font-semibold">Total Lines</Label>

        {/* Headers - hidden on mobile */}
        {((value.totalLines ?? []).length > 0) && (
          <div className="hidden sm:flex gap-2 text-xs font-semibold text-muted-foreground px-1">
            <div className="flex-1">Title</div>
            <div className="w-28 sm:w-32">Value</div>
            <div className="w-8"></div>
          </div>
        )}

        {(value.totalLines ?? []).map((line, index) => (
          <div key={index} className="flex gap-2 items-center p-2 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none bg-muted/30 sm:bg-transparent">
            <Input
              placeholder="e.g. Subtotal"
              value={line.title}
              onChange={(e) => updateTotalLine(index, "title", e.target.value)}
              className="flex-1 bg-background h-9 sm:h-10 text-sm"
            />
            <Input
              type="number"
              value={line.value}
              onChange={(e) => updateTotalLine(index, "value", parseFloat(e.target.value) || 0)}
              className="w-24 sm:w-32 bg-background text-right h-9 sm:h-10 text-sm"
              step="0.01"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeTotalLine(index)}
              className="h-9 w-9 sm:h-10 sm:w-8 text-destructive border-transparent hover:bg-destructive/10 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addTotalLine}
          className="w-full text-primary border-primary/20 hover:bg-primary/5 hover:text-primary h-9 sm:h-10 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add line
        </Button>
      </div>

      {/* Final Total */}
      <div className="space-y-3 sm:space-y-4 pt-2">
        <div className="flex gap-2 items-center">
          <Input
            value={value.total?.title ?? "Total"}
            onChange={(e) => onChange({ total: { title: e.target.value, value: value.total?.value ?? 0 } })}
            className="flex-1 bg-background h-9 sm:h-10 text-sm sm:text-base"
          />
          <Input
            type="number"
            value={value.total?.value ?? 0}
            onChange={(e) =>
              onChange({ total: { title: value.total?.title ?? "Total", value: parseFloat(e.target.value) || 0 } })
            }
            className="w-24 sm:w-32 bg-background text-right font-bold h-9 sm:h-10 text-sm sm:text-base"
            step="0.01"
          />
        </div>

        {/* Increase Total Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="inc-total-size"
              checked={value.increaseTotalSize?.enabled ?? false}
              onCheckedChange={(enabled) =>
                onChange({ increaseTotalSize: { enabled, percentage: value.increaseTotalSize?.percentage ?? "+50%" } })
              }
            />
            <Label htmlFor="inc-total-size" className="font-normal text-xs sm:text-sm">Increase "Total" number size</Label>
          </div>

          {value.increaseTotalSize?.enabled && (
            <div className="pl-8 sm:pl-12">
              <div className="flex flex-wrap gap-1">
                {TOTAL_SIZE_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={value.increaseTotalSize?.percentage === opt.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange({ increaseTotalSize: { enabled: true, percentage: opt.value } })}
                    className="h-7 text-xs px-2"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="pt-2 border-t">
        <DividerConfig
          value={value.bottomDivider ?? { enabled: false, style: "---" }}
          onChange={(bottomDivider) => onChange({ bottomDivider })}
          label="Divider at the bottom"
        />
      </div>
    </div>
  );
}

