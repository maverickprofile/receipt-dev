"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReceiptForm from "./ReceiptForm";
import ReceiptPreview from "./actions/ReceiptPreview";
import ReceiptActions from "./actions/ReceiptActions";

export default function ReceiptMain() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-4 sm:gap-6">
        {/* Left Column: Form */}
        <div className="space-y-3 sm:space-y-4">
          <ReceiptForm />
        </div>

        {/* Right Column: Actions & Preview */}
        <div className="space-y-3 sm:space-y-4 xl:sticky xl:top-8 h-fit">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Operations and preview</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <ReceiptActions />
            </CardContent>
          </Card>

          <ReceiptPreview />
        </div>
      </div>
    </div>
  );
}

