import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfigCategory, ConfigOption } from "@/types/configurator";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Search } from "lucide-react";

interface OptionFormCompatibilityProps {
  categories: ConfigCategory[];
  currentCategoryId?: string;
  selectedIncompatibilities: string[];
  onToggleIncompatibility: (optionId: string) => void;
  compatibilitySearch: string;
  setCompatibilitySearch: (search: string) => void;
  showAllCategories: boolean;
  setShowAllCategories: (show: boolean) => void;
}

export function OptionFormCompatibility({
  categories,
  currentCategoryId,
  selectedIncompatibilities,
  onToggleIncompatibility,
  compatibilitySearch,
  setCompatibilitySearch,
  showAllCategories,
  setShowAllCategories,
}: OptionFormCompatibilityProps) {
  const { formatPrice } = useCurrency();
  const currentCategory = categories.find((cat) => cat.id === currentCategoryId);
  const relatedCategoryIds = currentCategory?.relatedCategories || [];

  const relevantCategories = showAllCategories
    ? categories.filter((cat) => cat.id !== currentCategoryId)
    : categories.filter(
        (cat) =>
          cat.id !== currentCategoryId &&
          (relatedCategoryIds.includes(cat.id) || relatedCategoryIds.length === 0)
      );

  const allOptions = relevantCategories.flatMap((cat) =>
    cat.options.map((opt) => ({
      ...opt,
      categoryName: cat.name,
      categoryId: cat.id,
    }))
  );

  const filteredOptions = compatibilitySearch.trim()
    ? allOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(compatibilitySearch.toLowerCase()) ||
          opt.categoryName.toLowerCase().includes(compatibilitySearch.toLowerCase())
      )
    : allOptions;

  const groupedOptions = filteredOptions.reduce(
    (acc, opt) => {
      if (!acc[opt.categoryId]) {
        acc[opt.categoryId] = {
          categoryName: opt.categoryName,
          options: [],
        };
      }
      acc[opt.categoryId].options.push(opt);
      return acc;
    },
    {} as Record<string, { categoryName: string; options: typeof allOptions }>
  );

  if (filteredOptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No options available for incompatibility selection.</p>
        <p className="text-xs mt-2">Add options to other categories first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>Incompatible With (Optional)</Label>
        <p className="text-xs text-muted-foreground mt-1">
          ⚡ Mutual enforcement: If A is incompatible with B, B automatically becomes incompatible with A
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search options..."
          value={compatibilitySearch}
          onChange={(e) => setCompatibilitySearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="show-all"
          checked={showAllCategories}
          onCheckedChange={(checked) => setShowAllCategories(checked as boolean)}
        />
        <label htmlFor="show-all" className="text-sm cursor-pointer">
          Show options from all categories
        </label>
      </div>

      <div className="border border-border rounded-md max-h-64 overflow-y-auto">
        {Object.entries(groupedOptions).map(([catId, { categoryName, options }]) => (
          <div key={catId} className="border-b border-border last:border-b-0">
            <div className="bg-muted/50 px-4 py-2 font-medium text-sm sticky top-0">
              {categoryName}
            </div>
            <div className="p-2 space-y-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-muted/50 rounded"
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedIncompatibilities.includes(option.id)}
                    onCheckedChange={() => onToggleIncompatibility(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm cursor-pointer flex-1">
                    {option.label}
                    {option.price > 0 && (
                      <span className="text-muted-foreground ml-2">
                        (+{formatPrice(option.price)})
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedIncompatibilities.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedIncompatibilities.length} incompatible option(s) selected
        </p>
      )}
    </div>
  );
}
