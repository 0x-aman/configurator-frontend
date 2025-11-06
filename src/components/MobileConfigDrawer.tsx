import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isOptionIncompatibleWithSelection } from "@/utils/incompatibilityUtils";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ConfigCategory,
  ConfigOption,
  SelectedConfig,
} from "@/types/configurator";

interface MobileConfigDrawerProps {
  category: ConfigCategory;
  selectedOption?: ConfigOption;
  onOptionSelect: (optionId: string) => void;
  selectedConfig: SelectedConfig;
  categories: ConfigCategory[];
}

export function MobileConfigDrawer({
  category,
  selectedOption,
  onOptionSelect,
  selectedConfig,
  categories,
}: MobileConfigDrawerProps) {
  const { formatPrice } = useCurrency();
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string | undefined>(
    selectedOption?.id
  );

  const isOptionDisabled = (optionId: string): boolean => {
    const option = category.options?.find((o) => o.id === optionId);
    if (!option) return false;

    // Use mutual incompatibility check
    return isOptionIncompatibleWithSelection(
      option,
      selectedConfig,
      categories
    );
  };

  const handleConfirm = () => {
    if (tempSelection) {
      onOptionSelect(tempSelection);
      setOpen(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempSelection(selectedOption?.id);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Card className="p-4 cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.98] touch-manipulation">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                {category.name}
              </p>
              {selectedOption ? (
                <>
                  <p className="font-semibold text-foreground">
                    {selectedOption.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatPrice(selectedOption.price)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Tap to select</p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-2" />
          </div>
        </Card>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>{category.name}</DrawerTitle>
          <DrawerDescription>
            Select an option for {category.name.toLowerCase()}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4 space-y-3">
          {category.options?.map((option) => {
            const isSelected = tempSelection === option.id;
            const isDisabled = isOptionDisabled(option.id);

            return (
              <button
                key={option.id}
                onClick={() => !isDisabled && setTempSelection(option.id)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all touch-manipulation ${
                  isSelected
                    ? "border-primary bg-accent shadow-md"
                    : isDisabled
                    ? "border-muted bg-muted/20 opacity-50"
                    : "border-border bg-card active:scale-[0.98]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-foreground text-base">
                    {option.label}
                  </span>
                  <span
                    className={`font-bold text-base ${
                      option.price === 0 ? "text-success" : "text-foreground"
                    }`}
                  >
                    {formatPrice(option.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
                {isDisabled && (
                  <p className="text-xs text-destructive mt-2 font-medium">
                    ⚠️ Incompatible with current selection
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <DrawerFooter className="pt-4 border-t">
          <Button
            onClick={handleConfirm}
            disabled={!tempSelection}
            size="lg"
            className="w-full"
          >
            Confirm Selection
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
