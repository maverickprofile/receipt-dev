"use client";

import React from "react";
import { CreditCard, Sparkles } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// ShadCn
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CREDITS_PER_DOWNLOAD } from "@/lib/variables";

type OutOfCreditsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance?: number;
  required?: number;
};

const OutOfCreditsModal = ({
  open,
  onOpenChange,
  currentBalance = 0,
  required = CREDITS_PER_DOWNLOAD,
}: OutOfCreditsModalProps) => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";

  const handleViewPricing = () => {
    onOpenChange(false);
    router.push(`/${locale}/pricing`);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            Out of Credits
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              You&apos;ve used all your free downloads. Each download requires{" "}
              <strong>{required} credits</strong>.
            </p>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between items-center">
                <span>Your balance:</span>
                <span className="font-semibold text-foreground">
                  {currentBalance} credits
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Required:</span>
                <span className="font-semibold text-foreground">
                  {required} credits
                </span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Upgrade to a subscription to get more credits and unlimited
              downloads.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:w-auto">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleViewPricing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:w-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            View Pricing
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OutOfCreditsModal;
