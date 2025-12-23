"use client";

import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Alignment } from "@/lib/receipt-schemas";

interface AlignmentSelectorProps {
  value: Alignment;
  onChange: (value: Alignment) => void;
  label?: string;
}

export default function AlignmentSelector({
  value,
  onChange,
  label = "Alignment",
}: AlignmentSelectorProps) {
  const alignments: { value: Alignment; icon: React.ReactNode; label: string }[] = [
    { value: "left", icon: <AlignLeft className="h-4 w-4" />, label: "Left" },
    { value: "center", icon: <AlignCenter className="h-4 w-4" />, label: "Center" },
    { value: "right", icon: <AlignRight className="h-4 w-4" />, label: "Right" },
  ];

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <Label className="text-xs sm:text-sm">{label}</Label>
      <div className="flex gap-1">
        {alignments.map((alignment) => (
          <Button
            key={alignment.value}
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 h-8 sm:h-9",
              value === alignment.value && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => onChange(alignment.value)}
            title={alignment.label}
          >
            {alignment.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}

