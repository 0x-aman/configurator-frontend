import { FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfigCategory, SelectedConfig } from "@/types/configurator";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
}

export function ExportDialog({
  open,
  onOpenChange,
  categories,
  selectedConfig,
}: ExportDialogProps) {
  const { formatPrice } = useCurrency();
  const calculateTotal = () => {
    let total = 0;
    categories.forEach((category) => {
      const selectedOptionId = selectedConfig[category.id];
      const option = category.options?.find((o) => o.id === selectedOptionId);
      if (option) {
        total += option.price;
      }
    });
    return total;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    alert(
      "PDF export functionality would be implemented here using a library like jsPDF"
    );
    console.log("Exporting configuration to PDF...");
  };

  const total = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Export Configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Configuration Summary</h3>

          {categories.map((category) => {
            const selectedOptionId = selectedConfig[category.id];
            const option = category.options?.find(
              (o) => o.id === selectedOptionId
            );

            if (!option) return null;

            return (
              <Card
                key={category.id}
                className="p-4 bg-accent/30 border-primary/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(option.price)}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {option.label}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </Card>
            );
          })}

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">
                Total Configuration Price
              </span>
              <span className="text-3xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleExportPDF} className="flex-1">
              <FileDown className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
