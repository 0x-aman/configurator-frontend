import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { TextColorMode } from "@/types/theme";

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

interface ThemePreviewProps {
  color: string;
  textColorMode: TextColorMode;
  customTextColor?: string;
}

function getTextColor(primaryColor: string, mode: TextColorMode, customColor?: string): string {
  if (mode === "white") return "#ffffff";
  if (mode === "black") return "#000000";
  if (mode === "custom" && customColor) return customColor;
  
  // Auto: contrast-based
  const hsl = hexToHSL(primaryColor);
  return hsl.l > 50 ? "#000000" : "#ffffff";
}

export function ThemePreview({ color, textColorMode, customTextColor }: ThemePreviewProps) {
  const textColor = getTextColor(color, textColorMode, customTextColor);
  
  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
      <h3 className="text-sm font-medium text-foreground mb-3">Preview</h3>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Button</p>
          <Button style={{ backgroundColor: color, borderColor: color, color: textColor }} size="sm">
            <Check className="h-4 w-4 mr-2" />
            Primary Button
          </Button>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Selected Option</p>
          <div
            className="p-3 rounded-lg border-2 bg-accent/50"
            style={{ borderColor: color }}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="font-medium text-foreground text-sm">Premium Option</span>
              <span className="text-sm font-semibold text-foreground">$1,200</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is how selected options will appear
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Badge</p>
          <Badge style={{ backgroundColor: color, borderColor: color, color: textColor }}>Featured</Badge>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Card Accent</p>
          <Card
            className="p-3 bg-accent/30"
            style={{ borderColor: `${color}33` }}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color }}
              >
                Category Name
              </span>
              <span className="text-sm font-semibold text-foreground">$500</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Option Label</h3>
            <p className="text-xs text-muted-foreground">Option description text</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
