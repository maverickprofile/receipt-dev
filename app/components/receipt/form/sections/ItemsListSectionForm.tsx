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
    currentTotalLines: typeof value.totalLines
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

    return {
      totalLines: newTotalLines,
      total: { ...value.total, value: grandTotal },
    };
  };

  // Items handlers
  const updateItem = (index: number, field: keyof ReceiptItem, newValue: string | number) => {
    const newItems = [...value.items];
    newItems[index] = { ...newItems[index], [field]: newValue };

    const updates = calculateUpdates(newItems, value.totalLines);
    onChange({ items: newItems, ...updates });
  };

  const addItem = () => {
    const newItems = [...value.items, { quantity: 1, name: "", price: 0 }];
    const updates = calculateUpdates(newItems, value.totalLines);
    onChange({ items: newItems, ...updates });
  };

  const removeItem = (index: number) => {
    const newItems = value.items.filter((_, i) => i !== index);
    const finalItems = newItems.length ? newItems : [{ quantity: 1, name: "", price: 0 }];

    const updates = calculateUpdates(finalItems, value.totalLines);
    onChange({ items: finalItems, ...updates });
  };

  // Total lines handlers
  const updateTotalLine = (index: number, field: keyof TotalLine, newValue: string | number) => {
    const newTotalLines = [...value.totalLines];
    newTotalLines[index] = { ...newTotalLines[index], [field]: newValue };

    // Recalculate Grand Total only
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);

    onChange({
      totalLines: newTotalLines,
      total: { ...value.total, value: grandTotal }
    });
  };

  const addTotalLine = () => {
    const newTotalLines = [...value.totalLines, { title: "", value: 0 }];
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);
    onChange({ totalLines: newTotalLines, total: { ...value.total, value: grandTotal } });
  };

  const removeTotalLine = (index: number) => {
    const newTotalLines = value.totalLines.filter((_, i) => i !== index);
    const grandTotal = newTotalLines.reduce((sum, line) => sum + line.value, 0);
    onChange({ totalLines: newTotalLines, total: { ...value.total, value: grandTotal } });
  };

  return (
    <div className="space-y-6">
      {/* Items */}
      <div className="space-y-2">
        {/* Headers */}
        <div className="flex gap-2 text-xs font-semibold text-muted-foreground px-1">
          <div className="w-16">Quantity</div>
          <div className="flex-1">Item</div>
          <div className="w-24">Total price</div>
          <div className="w-8"></div>
        </div>

        {value.items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
              className="w-16 bg-background text-center"
              min={1}
            />
            <Input
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="flex-1 bg-background"
            />
            <Input
              type="number"
              value={item.price}
              onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
              className="w-24 bg-background text-right"
              step="0.01"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={value.items.length === 1}
              className="h-10 w-8 text-destructive border-transparent hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
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
        <Label className="text-sm font-semibold">Total Lines</Label>

        {/* Headers */}
        {(value.totalLines.length > 0) && (
          <div className="flex gap-2 text-xs font-semibold text-muted-foreground px-1">
            <div className="flex-1">Title</div>
            <div className="w-32">Value</div>
            <div className="w-8"></div>
          </div>
        )}

        {value.totalLines.map((line, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="e.g. Subtotal"
              value={line.title}
              onChange={(e) => updateTotalLine(index, "title", e.target.value)}
              className="flex-1 bg-background"
            />
            <Input
              type="number"
              value={line.value}
              onChange={(e) => updateTotalLine(index, "value", parseFloat(e.target.value) || 0)}
              className="w-32 bg-background text-right"
              step="0.01"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeTotalLine(index)}
              className="h-10 w-8 text-destructive border-transparent hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addTotalLine}
          className="w-full text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add line
        </Button>
      </div>

      {/* Final Total */}
      <div className="space-y-4 pt-2">
        <div className="flex gap-2 items-center">
          <Input
            value={value.total.title}
            onChange={(e) => onChange({ total: { ...value.total, title: e.target.value } })}
            className="flex-1 bg-background"
          />
          <Input
            type="number"
            value={value.total.value}
            onChange={(e) =>
              onChange({ total: { ...value.total, value: parseFloat(e.target.value) || 0 } })
            }
            className="w-32 bg-background text-right font-bold"
            step="0.01"
          />
        </div>

        {/* Increase Total Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="inc-total-size"
              checked={value.increaseTotalSize.enabled}
              onCheckedChange={(enabled) =>
                onChange({ increaseTotalSize: { ...value.increaseTotalSize, enabled } })
              }
            />
            <Label htmlFor="inc-total-size" className="font-normal">Increase "Total" number size</Label>
          </div>

          {value.increaseTotalSize.enabled && (
            <div className="pl-12">
              <div className="flex gap-1">
                {TOTAL_SIZE_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={value.increaseTotalSize.percentage === opt.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange({ increaseTotalSize: { ...value.increaseTotalSize, percentage: opt.value } })}
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
          value={value.bottomDivider}
          onChange={(bottomDivider) => onChange({ bottomDivider })}
          label="Divider at the bottom"
        />
      </div>
    </div>
  );
}

