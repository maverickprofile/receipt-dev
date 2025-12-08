"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DividerConfig from "./DividerConfig";
import type { TwoColumnSection, KeyValuePair } from "@/lib/receipt-schemas";

interface TwoColumnSectionFormProps {
  value: TwoColumnSection;
  onChange: (updates: Partial<TwoColumnSection>) => void;
}

export default function TwoColumnSectionForm({
  value,
  onChange,
}: TwoColumnSectionFormProps) {
  const updateColumn1 = (index: number, field: keyof KeyValuePair, newValue: string) => {
    const newColumn1 = [...value.column1];
    newColumn1[index] = { ...newColumn1[index], [field]: newValue };
    onChange({ column1: newColumn1 });
  };

  const updateColumn2 = (index: number, field: keyof KeyValuePair, newValue: string) => {
    const newColumn2 = [...value.column2];
    newColumn2[index] = { ...newColumn2[index], [field]: newValue };
    onChange({ column2: newColumn2 });
  };

  const addColumn1Row = () => {
    onChange({ column1: [...value.column1, { key: "", value: "" }] });
  };

  const addColumn2Row = () => {
    onChange({ column2: [...value.column2, { key: "", value: "" }] });
  };

  const removeColumn1Row = (index: number) => {
    const newColumn1 = value.column1.filter((_, i) => i !== index);
    onChange({ column1: newColumn1.length ? newColumn1 : [{ key: "", value: "" }] });
  };

  const removeColumn2Row = (index: number) => {
    const newColumn2 = value.column2.filter((_, i) => i !== index);
    onChange({ column2: newColumn2.length ? newColumn2 : [{ key: "", value: "" }] });
  };

  return (
    <div className="space-y-4">
      {/* Column 1 */}
      <div className="space-y-2">
        <Label>Column 1</Label>
        {value.column1.map((row, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Key"
              value={row.key}
              onChange={(e) => updateColumn1(index, "key", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={row.value}
              onChange={(e) => updateColumn1(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeColumn1Row(index)}
              disabled={value.column1.length === 1}
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
          onClick={addColumn1Row}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row to Column 1
        </Button>
      </div>

      {/* Column 2 */}
      <div className="space-y-2">
        <Label>Column 2</Label>
        {value.column2.map((row, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Key"
              value={row.key}
              onChange={(e) => updateColumn2(index, "key", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={row.value}
              onChange={(e) => updateColumn2(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeColumn2Row(index)}
              disabled={value.column2.length === 1}
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
          onClick={addColumn2Row}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row to Column 2
        </Button>
      </div>

      {/* Divider */}
      <DividerConfig
        value={value.divider}
        onChange={(divider) => onChange({ divider })}
      />
    </div>
  );
}

