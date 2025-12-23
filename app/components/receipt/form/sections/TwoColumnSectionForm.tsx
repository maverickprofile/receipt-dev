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
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Column 1 */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-xs sm:text-sm font-medium">Column 1</Label>
            <div className="space-y-2">
              {value.column1.map((row, index) => (
                <div key={index} className="flex gap-1.5 sm:gap-2 items-center p-2 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none bg-muted/30 sm:bg-transparent">
                  <Input
                    placeholder="Key"
                    value={row.key}
                    onChange={(e) => updateColumn1(index, "key", e.target.value)}
                    className="flex-1 bg-background h-9 sm:h-10 text-sm"
                  />
                  <Input
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateColumn1(index, "value", e.target.value)}
                    className="flex-1 bg-background h-9 sm:h-10 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeColumn1Row(index)}
                    className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-destructive border-transparent hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addColumn1Row}
              className="w-full h-9 sm:h-10 text-xs sm:text-sm text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add line
            </Button>
          </div>

          {/* Column 2 */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-xs sm:text-sm font-medium">Column 2</Label>
            <div className="space-y-2">
              {value.column2.map((row, index) => (
                <div key={index} className="flex gap-1.5 sm:gap-2 items-center p-2 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none bg-muted/30 sm:bg-transparent">
                  <Input
                    placeholder="Key"
                    value={row.key}
                    onChange={(e) => updateColumn2(index, "key", e.target.value)}
                    className="flex-1 bg-background h-9 sm:h-10 text-sm"
                  />
                  <Input
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateColumn2(index, "value", e.target.value)}
                    className="flex-1 bg-background h-9 sm:h-10 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeColumn2Row(index)}
                    className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-destructive border-transparent hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addColumn2Row}
              className="w-full h-9 sm:h-10 text-xs sm:text-sm text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add line
            </Button>
          </div>
        </div>

        {/* Divider */}
        <DividerConfig
          value={value.divider}
          onChange={(divider) => onChange({ divider })}
        />
      </div>
    </div>

  );
}

