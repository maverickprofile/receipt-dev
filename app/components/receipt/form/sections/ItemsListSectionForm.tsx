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
  // Items handlers
  const updateItem = (index: number, field: keyof ReceiptItem, newValue: string | number) => {
    const newItems = [...value.items];
    newItems[index] = { ...newItems[index], [field]: newValue };
    onChange({ items: newItems });
  };

  const addItem = () => {
    onChange({
      items: [...value.items, { quantity: 1, name: "", price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = value.items.filter((_, i) => i !== index);
    onChange({ items: newItems.length ? newItems : [{ quantity: 1, name: "", price: 0 }] });
  };

  // Total lines handlers
  const updateTotalLine = (index: number, field: keyof TotalLine, newValue: string | number) => {
    const newTotalLines = [...value.totalLines];
    newTotalLines[index] = { ...newTotalLines[index], [field]: newValue };
    onChange({ totalLines: newTotalLines });
  };

  const addTotalLine = () => {
    onChange({
      totalLines: [...value.totalLines, { title: "", value: 0 }],
    });
  };

  const removeTotalLine = (index: number) => {
    const newTotalLines = value.totalLines.filter((_, i) => i !== index);
    onChange({ totalLines: newTotalLines });
  };

  return (
    <div className="space-y-6">
      {/* Items */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Items</Label>
        {value.items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
              className="w-16"
              min={1}
            />
            <Input
              placeholder="Item name"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
              className="w-24"
              step="0.01"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={value.items.length === 1}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Items Divider */}
      <DividerConfig
        value={value.divider}
        onChange={(divider) => onChange({ divider })}
        label="Items Divider"
      />

      {/* Total Lines (Subtotals, Tax, etc.) */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Total Lines</Label>
        {value.totalLines.map((line, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Title (e.g., Subtotal)"
              value={line.title}
              onChange={(e) => updateTotalLine(index, "title", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Value"
              value={line.value}
              onChange={(e) => updateTotalLine(index, "value", parseFloat(e.target.value) || 0)}
              className="w-32"
              step="0.01"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeTotalLine(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTotalLine}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Total Line
        </Button>
      </div>

      {/* Final Total */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Total</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Title (e.g., Total)"
            value={value.total.title}
            onChange={(e) => onChange({ total: { ...value.total, title: e.target.value } })}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Value"
            value={value.total.value}
            onChange={(e) =>
              onChange({ total: { ...value.total, value: parseFloat(e.target.value) || 0 } })
            }
            className="w-32"
            step="0.01"
          />
        </div>
      </div>

      {/* Increase Total Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Increase total size</Label>
          <Switch
            checked={value.increaseTotalSize.enabled}
            onCheckedChange={(enabled) =>
              onChange({ increaseTotalSize: { ...value.increaseTotalSize, enabled } })
            }
          />
        </div>
        {value.increaseTotalSize.enabled && (
          <Select
            value={value.increaseTotalSize.percentage}
            onValueChange={(val: TotalSizePercentage) =>
              onChange({ increaseTotalSize: { ...value.increaseTotalSize, percentage: val } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOTAL_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Bottom Divider */}
      <DividerConfig
        value={value.bottomDivider}
        onChange={(bottomDivider) => onChange({ bottomDivider })}
        label="Bottom Divider"
      />
    </div>
  );
}

