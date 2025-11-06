import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { predefinedColors } from "@/data/themeColors";
import { ThemePreview } from "@/components/theme/ThemePreview";
import { Theme, TextColorMode } from "@/types/theme";
import { Check, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: Theme | null;
  onUpdateTheme: (updates: Partial<Theme>) => void;
  onResetTheme: () => void;
}

export function ThemeCustomizer({
  open,
  onOpenChange,
  currentTheme,
  onUpdateTheme,
  onResetTheme,
}: ThemeCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState(currentTheme?.primaryColor || "#3b82f6");
  const [customHex, setCustomHex] = useState(currentTheme?.primaryColor || "#3b82f6");
  const [textColorMode, setTextColorMode] = useState<TextColorMode>(currentTheme?.textColorMode || "auto");
  const [customTextColor, setCustomTextColor] = useState(currentTheme?.customTextColor || "#ffffff");

  useEffect(() => {
    if (currentTheme) {
      setSelectedColor(currentTheme.primaryColor);
      setCustomHex(currentTheme.primaryColor);
      setTextColorMode(currentTheme.textColorMode || "auto");
      setCustomTextColor(currentTheme.customTextColor || "#ffffff");
    }
  }, [currentTheme]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomHex(color);
  };

  const handleCustomHexChange = (value: string) => {
    setCustomHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setSelectedColor(value);
    }
  };

  const handleApply = () => {
    onUpdateTheme({ 
      primaryColor: selectedColor,
      textColorMode,
      customTextColor: textColorMode === "custom" ? customTextColor : undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    onResetTheme();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>
            Choose a color scheme for your product configurator
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Tabs defaultValue="predefined" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predefined">Preset Colors</TabsTrigger>
                <TabsTrigger value="custom">Custom Color</TabsTrigger>
              </TabsList>

              <TabsContent value="predefined" className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-4 gap-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className="relative group"
                        title={color.name}
                      >
                        <div
                          className="w-full aspect-square rounded-lg transition-all border-2 hover:scale-105"
                          style={{
                            backgroundColor: color.value,
                            borderColor:
                              selectedColor === color.value
                                ? color.value
                                : "transparent",
                          }}
                        >
                          {selectedColor === color.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="h-5 w-5 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center mt-1 text-muted-foreground group-hover:text-foreground transition-colors">
                          {color.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="custom" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-hex">Hex Color Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-hex"
                      type="text"
                      value={customHex}
                      onChange={(e) => handleCustomHexChange(e.target.value)}
                      placeholder="#3b82f6"
                      className="font-mono"
                      maxLength={7}
                    />
                    <Input
                      type="color"
                      value={customHex}
                      onChange={(e) => handleCustomHexChange(e.target.value)}
                      className="w-20 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a hex color code (e.g., #3b82f6) or use the color picker
                  </p>
                </div>

                <div
                  className="w-full h-32 rounded-lg border-2 border-border"
                  style={{ backgroundColor: selectedColor }}
                />
              </TabsContent>
            </Tabs>

            <div className="space-y-3 pt-4 border-t">
              <Label>Text Color on Primary</Label>
              <RadioGroup value={textColorMode} onValueChange={(value) => setTextColorMode(value as TextColorMode)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto" className="font-normal cursor-pointer">Auto (Contrast-based)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="white" />
                  <Label htmlFor="white" className="font-normal cursor-pointer">White</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="black" />
                  <Label htmlFor="black" className="font-normal cursor-pointer">Black</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="font-normal cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>

              {textColorMode === "custom" && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="custom-text-color">Custom Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-text-color"
                      type="text"
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      placeholder="#ffffff"
                      className="font-mono"
                      maxLength={7}
                    />
                    <Input
                      type="color"
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      className="w-20 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <ThemePreview 
              color={selectedColor} 
              textColorMode={textColorMode}
              customTextColor={customTextColor}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
