"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReceiptForm from "./ReceiptForm";
import ReceiptPreview from "./actions/ReceiptPreview";
import ReceiptActions from "./actions/ReceiptActions";

export default function ReceiptMain() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
        {/* Left Column: Form */}
        <div className="space-y-4">
          <ReceiptForm />
        </div>

        {/* Right Column: Actions & Preview */}
        <div className="space-y-4 lg:sticky lg:top-8 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Operations and preview</CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptActions />
            </CardContent>
          </Card>

          <ReceiptPreview />
        </div>
      </div>
    </div>
  );
}

