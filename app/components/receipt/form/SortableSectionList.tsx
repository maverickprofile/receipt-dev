"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReceiptContext } from "@/contexts/ReceiptContext";
import type { ReceiptSection } from "@/lib/receipt-schemas";

// Section Components
import {
  SectionWrapper,
  HeaderSectionForm,
  DateTimeSectionForm,
  CustomMessageSectionForm,
  TwoColumnSectionForm,
  ItemsListSectionForm,
  PaymentSectionForm,
  BarcodeSectionForm,
} from "./sections";
import type {
  HeaderSection,
  DateTimeSection,
  CustomMessageSection,
  TwoColumnSection,
  ItemsListSection,
  PaymentSection,
  BarcodeSection,
} from "@/lib/receipt-schemas";

// =============================================================================
// Sortable Item Component
// =============================================================================

interface SortableItemProps {
  section: ReceiptSection;
}

function SortableItem({ section }: SortableItemProps) {
  const { updateSection, removeSection, duplicateSection } = useReceiptContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const handleSectionUpdate = (updates: Partial<ReceiptSection>) => {
    updateSection(section.id, updates);
  };

  const handleRemove = () => {
    removeSection(section.id);
  };

  const handleDuplicate = () => {
    duplicateSection(section.id);
  };

  // Render section content based on type
  const renderSectionContent = () => {
    switch (section.type) {
      case "header":
        return (
          <HeaderSectionForm
            value={section as HeaderSection}
            onChange={handleSectionUpdate}
          />
        );
      case "datetime":
        return (
          <DateTimeSectionForm
            value={section as DateTimeSection}
            onChange={handleSectionUpdate}
          />
        );
      case "custom_message":
        return (
          <CustomMessageSectionForm
            value={section as CustomMessageSection}
            onChange={handleSectionUpdate}
          />
        );
      case "two_column":
        return (
          <TwoColumnSectionForm
            value={section as TwoColumnSection}
            onChange={handleSectionUpdate}
          />
        );
      case "items_list":
        return (
          <ItemsListSectionForm
            value={section as ItemsListSection}
            onChange={handleSectionUpdate}
          />
        );
      case "payment":
        return (
          <PaymentSectionForm
            value={section as PaymentSection}
            onChange={handleSectionUpdate}
          />
        );
      case "barcode":
        return (
          <BarcodeSectionForm
            value={section as BarcodeSection}
            onChange={handleSectionUpdate}
          />
        );
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionWrapper
        sectionId={section.id}
        sectionType={section.type}
        onRemove={handleRemove}
        onDuplicate={handleDuplicate}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {renderSectionContent()}
      </SectionWrapper>
    </div>
  );
}

// =============================================================================
// Sortable Section List Component
// =============================================================================

export default function SortableSectionList() {
  const { receipt, reorderSections } = useReceiptContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && receipt) {
      const oldIndex = receipt.sections.findIndex((s) => s.id === active.id);
      const newIndex = receipt.sections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(oldIndex, newIndex);
      }
    }
  };

  if (!receipt || receipt.sections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sections added. Click &quot;Add Section&quot; to get started.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={receipt.sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {receipt.sections.map((section) => (
            <SortableItem key={section.id} section={section} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

