import { useState, useEffect } from "react";
import { Theme } from "@/types/theme";
import { themeService } from "@/services/themeService";
import { toast } from "@/hooks/use-toast";

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

function applyThemeToDOM(primaryColor: string, textColorMode: string = "auto", customTextColor?: string) {
  const hsl = hexToHSL(primaryColor);
  document.documentElement.style.setProperty("--primary", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  
  // Set accent colors based on primary theme
  document.documentElement.style.setProperty("--accent", `${hsl.h} ${Math.min(hsl.s, 100)}% 97%`);
  document.documentElement.style.setProperty("--accent-foreground", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  document.documentElement.style.setProperty("--ring", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  
  let foregroundHSL;
  if (textColorMode === "white") {
    foregroundHSL = "0 0% 98%";
  } else if (textColorMode === "black") {
    foregroundHSL = "0 0% 10%";
  } else if (textColorMode === "custom" && customTextColor) {
    const customHSL = hexToHSL(customTextColor);
    foregroundHSL = `${customHSL.h} ${customHSL.s}% ${customHSL.l}%`;
  } else {
    // Auto: contrast-based
    foregroundHSL = `${hsl.h} ${hsl.s}% ${hsl.l > 50 ? 10 : 98}%`;
  }
  
  document.documentElement.style.setProperty("--primary-foreground", foregroundHSL);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setIsLoading(true);
    try {
      const activeTheme = await themeService.getActiveTheme();
      setTheme(activeTheme);
      applyThemeToDOM(activeTheme.primaryColor, activeTheme.textColorMode, activeTheme.customTextColor);
    } catch (error) {
      console.error("Failed to load theme:", error);
      toast({
        title: "Error",
        description: "Failed to load theme. Using default.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (updates: Partial<Theme>) => {
    try {
      const updatedTheme = await themeService.saveTheme({
        ...theme,
        ...updates,
      });
      setTheme(updatedTheme);
      applyThemeToDOM(updatedTheme.primaryColor, updatedTheme.textColorMode, updatedTheme.customTextColor);
      toast({
        title: "Theme updated",
        description: "Your theme has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme.",
        variant: "destructive",
      });
    }
  };

  const resetTheme = async () => {
    try {
      const defaultTheme = await themeService.resetToDefault();
      setTheme(defaultTheme);
      applyThemeToDOM(defaultTheme.primaryColor, defaultTheme.textColorMode, defaultTheme.customTextColor);
      toast({
        title: "Theme reset",
        description: "Theme has been reset to default.",
      });
    } catch (error) {
      console.error("Failed to reset theme:", error);
      toast({
        title: "Error",
        description: "Failed to reset theme.",
        variant: "destructive",
      });
    }
  };

  return {
    theme,
    isLoading,
    updateTheme,
    resetTheme,
  };
}
