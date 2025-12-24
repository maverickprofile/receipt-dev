"use client";

import ReceiptForm from "./ReceiptForm";
import ReceiptPreview from "./actions/ReceiptPreview";
import ReceiptActions from "./actions/ReceiptActions";

export default function ReceiptMain() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,480px] 2xl:grid-cols-[1fr,550px] gap-4 sm:gap-6">
        {/* Left Column: Form */}
        <div className="space-y-3 sm:space-y-4">
          <ReceiptForm />
        </div>

        {/* Right Column: Actions & Preview */}
        <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-24 h-fit">
          {/* Actions Header Bar */}
          <ReceiptActions />

          {/* Preview */}
          <ReceiptPreview />
        </div>
      </div>
    </div>
  );
}

