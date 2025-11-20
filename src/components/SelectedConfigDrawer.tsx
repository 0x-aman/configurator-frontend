import { Button } from "@/components/ui/button";
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
import { ConfigCategory, SelectedConfig } from "@/types/configurator";
import { useCurrency } from "@/contexts/CurrencyContext";
import { List } from "lucide-react";

interface SelectedConfigDrawerProps {
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
  totalPrice: string;
}

export function SelectedConfigDrawer({
  categories,
  selectedConfig,
  totalPrice,
}: SelectedConfigDrawerProps) {
  const { formatPrice } = useCurrency();
  const hasSelections = Object.values(selectedConfig).some((val) => val !== "");

  const selectedItems = categories
    .map((category) => {
      const selectedOptionId = selectedConfig[category.id];
      const option = category.options?.find((o) => o.id === selectedOptionId);
      return option ? { category, option } : null;
    })
    .filter(Boolean);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-card border-2 border-primary/20 hover:border-primary/40 active:scale-[0.98] touch-manipulation"
        >
          <List className="h-5 w-5 mr-2" />
          View Selected Configuration ({selectedItems.length})
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Your Configuration</DrawerTitle>
          <DrawerDescription>
            Review all selected options and total price
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4">
          {!hasSelections ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base">No options selected yet</p>
              <p className="text-sm mt-2">
                Configure your product to see selections here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedItems.map((item) => {
                if (!item) return null;
                const { category, option } = item;

                return (
                  <div
                    key={category.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                      {category.name}
                    </p>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-base">
                          {option.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                      <p className="font-bold text-lg text-foreground ml-4">
                        {formatPrice(option.price)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Total Price */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Price
                </p>
                <p className="text-4xl font-bold text-primary">{totalPrice}</p>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="pt-4 border-t">
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
