import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";

const INFO_STORAGE_KEY = "configuratorInfoDismissed";

interface ConfiguratorInfoPopupProps {
  isAdminMode: boolean;
  configuratorFound: boolean;
}

export function ConfiguratorInfoPopup({
  isAdminMode,
  configuratorFound,
}: ConfiguratorInfoPopupProps) {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Check if popup should be shown on mount
  useEffect(() => {
    if (isAdminMode && configuratorFound) {
      const isDismissed = localStorage.getItem(INFO_STORAGE_KEY) === "true";
      if (!isDismissed) {
        // Small delay to ensure UI is ready
        setTimeout(() => setOpen(true), 500);
      }
    }
  }, [isAdminMode, configuratorFound]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(INFO_STORAGE_KEY, "true");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-xl">Configurator Info</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Important information about how the configurator works
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-foreground">
                There can be <strong>one and ONLY one primary category</strong>.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-foreground">
                The <strong>first category</strong> is considered the primary
                category.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-foreground">
                You can <strong>rename category titles</strong> anytime.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-foreground">
                The primary category acts as the <strong>base</strong>, and it
                has a <strong>limit</strong>.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-foreground">
                Once the limit is reached, you must{" "}
                <strong>upgrade/pay to unlock 10 more options</strong>.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <p className="text-foreground">
                You can use <strong>Import CSV</strong> for faster bulk uploads.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dontShow"
                checked={dontShowAgain}
                onCheckedChange={(checked) =>
                  setDontShowAgain(checked as boolean)
                }
              />
              <Label
                htmlFor="dontShow"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Don't show this again
              </Label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose} className="w-full sm:w-auto">
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
