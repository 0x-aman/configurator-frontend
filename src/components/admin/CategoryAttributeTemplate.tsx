import { ConfigAttribute, AttributeType } from "@/types/configurator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CategoryAttributeTemplateProps {
  attributes: ConfigAttribute[];
  setAttributes: (attributes: ConfigAttribute[]) => void;
}

export function CategoryAttributeTemplate({
  attributes,
  setAttributes,
}: CategoryAttributeTemplateProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addAttribute = () => {
    const newAttr: ConfigAttribute = {
      key: "",
      label: "",
      type: "text",
    };
    setAttributes([...attributes, newAttr]);
    setExpandedIndex(attributes.length);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const updateAttribute = (index: number, field: keyof ConfigAttribute, value: any) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    setAttributes(updated);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Attribute Template</Label>
        <Button type="button" onClick={addAttribute} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Attribute
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Define attributes that all options in this category will have. Options will provide values for these attributes.
      </p>

      {attributes.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">
          No attributes defined. Click "Add Attribute" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {attributes.map((attr, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-sm">
                    {attr.label || `Attribute ${index + 1}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({attr.type})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAttribute(index);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-4 space-y-3 bg-card">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Key *</Label>
                      <Input
                        value={attr.key}
                        onChange={(e) => updateAttribute(index, "key", e.target.value)}
                        placeholder="e.g., material"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Label *</Label>
                      <Input
                        value={attr.label}
                        onChange={(e) => updateAttribute(index, "label", e.target.value)}
                        placeholder="e.g., Material Type"
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Type *</Label>
                    <Select
                      value={attr.type}
                      onValueChange={(value) =>
                        updateAttribute(index, "type", value as AttributeType)
                      }
                    >
                      <SelectTrigger className="h-9">
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

                  {(attr.type === "number" || attr.type === "dimension") && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Unit</Label>
                        <Input
                          value={attr.unit || ""}
                          onChange={(e) => updateAttribute(index, "unit", e.target.value)}
                          placeholder="mm, kg, V"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Min</Label>
                        <Input
                          type="number"
                          value={attr.min ?? ""}
                          onChange={(e) =>
                            updateAttribute(index, "min", e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Max</Label>
                        <Input
                          type="number"
                          value={attr.max ?? ""}
                          onChange={(e) =>
                            updateAttribute(index, "max", e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}

                  {attr.type === "select" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Options (comma-separated)</Label>
                      <Input
                        value={attr.options?.join(", ") || ""}
                        onChange={(e) =>
                          updateAttribute(
                            index,
                            "options",
                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        placeholder="Option 1, Option 2, Option 3"
                        className="h-9"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
