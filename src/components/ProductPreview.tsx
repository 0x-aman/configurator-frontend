import { FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigCategory, SelectedConfig } from "@/types/configurator";
import placeholder from "@/assets/placeholder.png";
import machineMedium from "@/assets/machine-medium.png";
import machineLarge from "@/assets/machine-large.png";
import { useMemo } from "react";

interface ProductPreviewProps {
  selectedConfig: SelectedConfig;
  categories: ConfigCategory[];
  totalPrice: string;
  onRequestQuote: () => void;
  onExport: () => void;
  isMobile: boolean;
}

export function ProductPreview({
  selectedConfig,
  categories,
  totalPrice,
  onRequestQuote,
  onExport,
  isMobile,
}: ProductPreviewProps) {
  const getPreviewImage = () => {
    // Check all selected options for an image, prioritizing most recently selected
    for (const categoryId of Object.keys(selectedConfig)) {
      const optionId = selectedConfig[categoryId];
      if (optionId) {
        const category = categories.find((c) => c.id === categoryId);
        const option = category?.options.find((o) => o.id === optionId);
        if (option?.imageUrl && option.imageUrl.trim() !== "") {
          return option.imageUrl;
        }
      }
    }

    // Default fallback image
    return placeholder;
  };

  const currentImage = useMemo(() => {
    for (const categoryId of Object.keys(selectedConfig)) {
      const optionId = selectedConfig[categoryId];
      const category = categories.find((c) => c.id === categoryId);
      const option = category?.options.find((o) => o.id === optionId);
      if (option?.imageUrl?.trim()) return option.imageUrl;
    }
    return placeholder;
  }, [selectedConfig, categories]);
  const hasAnySelection = Object.values(selectedConfig).some(
    (val) => val !== ""
  );
  const hasCategories = categories.length > 0;

  if (isMobile) {
    // Mobile Layout - Compact sticky preview
    return (
      <div className="bg-card border-b border-border">
        <div className="relative">
          {/* Sticky Request Quote Button */}
          <button
            onClick={onRequestQuote}
            className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-md font-medium text-xs hover:bg-primary/90 active:scale-95 transition-all touch-manipulation"
          >
            Request Quote
          </button>

          {/* Compact Product Image */}
          <div className="bg-accent pt-4 pb-3 px-4">
            <div className="flex items-center justify-center h-[200px]">
              {!hasCategories || !hasAnySelection ? (
                <div className="text-center text-muted-foreground px-4">
                  <p className="text-sm font-medium">No configuration</p>
                  <p className="text-xs mt-1">Select options below</p>
                </div>
              ) : (
                <div className="relative w-full max-w-[280px] h-full flex items-center justify-center">
                  <img
                    src={currentImage}
                    alt="Product Preview"
                    className="max-w-full max-h-full object-contain animate-fade-in"
                  />
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="text-center mt-3 pb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                Total Price
              </p>
              <div className="text-3xl font-bold text-primary">
                {totalPrice}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="bg-white h-full flex flex-col">
      <div className="bg-accent flex-1 flex flex-col items-center justify-between p-6">
        <div className="flex-1 flex items-center justify-center w-full">
          {!hasCategories || !hasAnySelection ? (
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No configuration selected</p>
              <p className="text-sm mt-2">
                Select options from the left panel to preview your configuration
              </p>
            </div>
          ) : (
            <div className="relative w-full max-w-xl">
              <img
                src={currentImage}
                alt="Product Preview"
                className="w-full h-auto animate-fade-in"
              />
            </div>
          )}
        </div>

        <div className="w-full max-w-md mt-8">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Total Configuration Price
              </p>
              <div className="text-4xl sm:text-5xl font-bold text-primary">
                {totalPrice}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onRequestQuote} className="flex-1" size="lg">
                <FileText className="h-5 w-5 mr-2" />
                Generate Quote
              </Button>
              <Button
                onClick={onExport}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <FileDown className="h-5 w-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
