import { ConfigAttribute } from "@/types/configurator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface OptionAttributeValuesProps {
  attributesTemplate: ConfigAttribute[];
  attributeValues: Record<string, any>;
  setAttributeValues: (values: Record<string, any>) => void;
}

export function OptionAttributeValues({
  attributesTemplate,
  attributeValues,
  setAttributeValues,
}: OptionAttributeValuesProps) {
  const updateValue = (key: string, value: any) => {
    setAttributeValues({
      ...attributeValues,
      [key]: value,
    });
  };

  if (attributesTemplate.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
        No attributes defined for this category. Edit the category to add attribute templates.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Fill in values for the attributes defined in this category's template.
      </p>

      <div className="space-y-3">
        {attributesTemplate.map((attr) => {
          const value = attributeValues[attr.key];

          return (
            <div key={attr.key} className="space-y-1.5">
              <Label className="text-sm">
                {attr.label}
                {attr.unit && <span className="text-muted-foreground ml-1">({attr.unit})</span>}
              </Label>

              {attr.type === "text" && (
                <Input
                  value={value || ""}
                  onChange={(e) => updateValue(attr.key, e.target.value)}
                  placeholder={`Enter ${attr.label.toLowerCase()}`}
                />
              )}

              {attr.type === "number" && (
                <Input
                  type="number"
                  value={value ?? ""}
                  onChange={(e) =>
                    updateValue(attr.key, e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  min={attr.min}
                  max={attr.max}
                  placeholder={`Enter ${attr.label.toLowerCase()}`}
                />
              )}

              {attr.type === "color" && (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={value || "#000000"}
                    onChange={(e) => updateValue(attr.key, e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={value || ""}
                    onChange={(e) => updateValue(attr.key, e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              )}

              {attr.type === "select" && (
                <Select value={value || ""} onValueChange={(val) => updateValue(attr.key, val)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${attr.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {attr.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {attr.type === "boolean" && (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={value || false}
                    onCheckedChange={(checked) => updateValue(attr.key, checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {value ? "Yes" : "No"}
                  </span>
                </div>
              )}

              {attr.type === "dimension" && (
                <Input
                  value={value || ""}
                  onChange={(e) => updateValue(attr.key, e.target.value)}
                  placeholder={`Enter ${attr.label.toLowerCase()}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
