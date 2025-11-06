import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency, CURRENCIES } from "@/types/settings";
import { DollarSign } from "lucide-react";

interface CurrencySelectorProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function CurrencySelector({ currentCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const handleCurrencyChange = (code: string) => {
    const currency = CURRENCIES.find((c) => c.code === code);
    if (currency) {
      onCurrencyChange(currency);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Currency Settings
        </CardTitle>
        <CardDescription>
          Select the currency for displaying prices throughout the configurator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currentCurrency.code} onValueChange={handleCurrencyChange}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-muted rounded-lg border">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sample price:</span>
              <span className="font-semibold">{currentCurrency.format(1234.56)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Large amount:</span>
              <span className="font-semibold">{currentCurrency.format(99999.99)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
