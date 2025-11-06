import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ConfigAttribute, AttributeType } from "@/types/configurator";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OptionFormAttributesProps {
  attributes: ConfigAttribute[];
  setAttributes: (attributes: ConfigAttribute[]) => void;
}

export function OptionFormAttributes({ attributes, setAttributes }: OptionFormAttributesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        key: "",
        label: "",
        type: "text",
      },
    ]);
    setExpandedIndex(attributes.length);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updateAttribute = (index: number, updates: Partial<ConfigAttribute>) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], ...updates };
    setAttributes(updated);
  };

  const updateSelectOptions = (index: number, optionsString: string) => {
    const options = optionsString.split(",").map((opt) => opt.trim()).filter(Boolean);
    updateAttribute(index, { options });
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Custom Attributes</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Define dynamic fields for this option (e.g., voltage, material, custom specs)
          </p>
        </div>
        <Button type="button" onClick={addAttribute} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Attribute
        </Button>
      </div>

      {attributes.length === 0 && (
        <Card className="p-6 text-center border-dashed">
          <p className="text-sm text-muted-foreground">
            No custom attributes yet. Click "Add Attribute" to create one.
          </p>
        </Card>
      )}

      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <Card key={index} className="p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(index)}
                  className="h-6 w-6 p-0"
                >
                  {expandedIndex === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <span className="font-medium text-sm">
                    {attr.label || attr.key || `Attribute ${index + 1}`}
                  </span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {attr.type}
                  </Badge>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAttribute(index)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 mt-3 pt-3 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Key (internal)</Label>
                    <Input
                      value={attr.key}
                      onChange={(e) => updateAttribute(index, { key: e.target.value })}
                      placeholder="e.g., voltage"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Label (display)</Label>
                    <Input
                      value={attr.label}
                      onChange={(e) => updateAttribute(index, { label: e.target.value })}
                      placeholder="e.g., Voltage"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={attr.type}
                    onValueChange={(value: AttributeType) =>
                      updateAttribute(index, { type: value })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="dimension">Dimension</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional fields based on type */}
                {(attr.type === "number" || attr.type === "dimension") && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Min</Label>
                      <Input
                        type="number"
                        value={attr.min || ""}
                        onChange={(e) =>
                          updateAttribute(index, { min: parseFloat(e.target.value) || undefined })
                        }
                        placeholder="Min"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Max</Label>
                      <Input
                        type="number"
                        value={attr.max || ""}
                        onChange={(e) =>
                          updateAttribute(index, { max: parseFloat(e.target.value) || undefined })
                        }
                        placeholder="Max"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Unit</Label>
                      <Input
                        value={attr.unit || ""}
                        onChange={(e) => updateAttribute(index, { unit: e.target.value })}
                        placeholder="e.g., V, mm"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                )}

                {attr.type === "select" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Options (comma-separated)</Label>
                    <Input
                      value={attr.options?.join(", ") || ""}
                      onChange={(e) => updateSelectOptions(index, e.target.value)}
                      placeholder="e.g., Small, Medium, Large"
                      className="h-8 text-sm"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs">Default Value</Label>
                  {attr.type === "boolean" ? (
                    <Select
                      value={attr.value?.toString() || "false"}
                      onValueChange={(value) =>
                        updateAttribute(index, { value: value === "true" })
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : attr.type === "select" ? (
                    <Select
                      value={attr.value || ""}
                      onValueChange={(value) => updateAttribute(index, { value })}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {(attr.options || []).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : attr.type === "color" ? (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={attr.value || "#000000"}
                        onChange={(e) => updateAttribute(index, { value: e.target.value })}
                        className="h-8 w-16"
                      />
                      <Input
                        value={attr.value || ""}
                        onChange={(e) => updateAttribute(index, { value: e.target.value })}
                        placeholder="#000000"
                        className="h-8 text-sm flex-1"
                      />
                    </div>
                  ) : (
                    <Input
                      type={attr.type === "number" ? "number" : "text"}
                      value={attr.value || ""}
                      onChange={(e) => updateAttribute(index, { value: e.target.value })}
                      placeholder="Default value"
                      className="h-8 text-sm"
                      min={attr.min}
                      max={attr.max}
                    />
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
