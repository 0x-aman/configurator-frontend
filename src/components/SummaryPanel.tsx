import { Card } from "@/components/ui/card";
import { ConfigCategory, SelectedConfig } from "@/types/configurator";
import { useCurrency } from "@/contexts/CurrencyContext";

interface SummaryPanelProps {
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
}

export function SummaryPanel({
  categories,
  selectedConfig,
}: SummaryPanelProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="h-full overflow-y-auto bg-card">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          Selected Configuration
        </h2>

        <div className="space-y-4 mb-6">
          {categories.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No configurations available</p>
            </div>
          ) : (
            categories.map((category) => {
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
                  <h3 className="font-semibold text-foreground mb-1">
                    {option.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>

                  {/* Display attribute values from category template */}
                  {category.attributesTemplate &&
                    category.attributesTemplate.length > 0 &&
                    option.attributeValues && (
                      <div className="mt-3 pt-3 border-t border-primary/10 space-y-1.5">
                        {category.attributesTemplate.map((attr) => {
                          const value = option.attributeValues?.[attr.key];
                          if (
                            value === undefined ||
                            value === null ||
                            value === ""
                          )
                            return null;

                          return (
                            <div
                              key={attr.key}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-muted-foreground">
                                {attr.label}:
                              </span>
                              <span className="font-medium text-foreground">
                                {attr.type === "boolean"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : value}
                                {attr.unit && ` ${attr.unit}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  {/* Legacy attributes support */}
                  {option.attributes && option.attributes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-primary/10 space-y-1.5">
                      {option.attributes.map((attr) => {
                        const value = attr.value;
                        if (
                          value === undefined ||
                          value === null ||
                          value === ""
                        )
                          return null;

                        return (
                          <div
                            key={attr.key}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-muted-foreground">
                              {attr.label}:
                            </span>
                            <span className="font-medium text-foreground">
                              {attr.type === "boolean"
                                ? value
                                  ? "Yes"
                                  : "No"
                                : value}
                              {attr.unit && ` ${attr.unit}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
