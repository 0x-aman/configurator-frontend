import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface BillingLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillingLimitModal({ open, onOpenChange }: BillingLimitModalProps) {
  const handleUpgrade = () => {
    window.open("https://konfigra.vercel.app/dashboard/billing", "_blank");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <AlertDialogTitle>Limit Reached</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            You've reached the maximum number of options allowed for your current plan.
            Upgrade your plan to add more options to your configurator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleUpgrade}>
            Increase Your Limit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
