import { Theme } from "@/types/theme";

const STORAGE_KEY = 'lovable_configurator_data';
const MOCK_KEY = "themes";

const mockStorage = {
  get<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  },

  remove(key: string): void {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`);
  },
};

const DEFAULT_THEME: Theme = {
  id: "default",
  name: "FinJet Industrial",
  primaryColor: "#0078FF",
  textColorMode: "auto",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

class ThemeService {
  async getActiveTheme(): Promise<Theme> {
    const themes = mockStorage.get<Theme[]>(MOCK_KEY, [DEFAULT_THEME]);
    const activeTheme = themes.find((t) => t.isActive);
    return activeTheme || DEFAULT_THEME;
  }

  async saveTheme(theme: Partial<Theme>): Promise<Theme> {
    const themes = mockStorage.get<Theme[]>(MOCK_KEY, [DEFAULT_THEME]);
    
    // Deactivate all themes
    const updatedThemes = themes.map((t) => ({ ...t, isActive: false }));

    const newTheme: Theme = {
      id: theme.id || `theme-${Date.now()}`,
      name: theme.name || "Custom Theme",
      primaryColor: theme.primaryColor || DEFAULT_THEME.primaryColor,
      textColorMode: theme.textColorMode || "auto",
      customTextColor: theme.customTextColor,
      isActive: true,
      createdAt: theme.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updatedThemes.push(newTheme);
    mockStorage.set(MOCK_KEY, updatedThemes);
    return newTheme;
  }

  async updateTheme(themeId: string, updates: Partial<Theme>): Promise<Theme> {
    const themes = mockStorage.get<Theme[]>(MOCK_KEY, [DEFAULT_THEME]);
    const themeIndex = themes.findIndex((t) => t.id === themeId);

    if (themeIndex === -1) {
      throw new Error("Theme not found");
    }

    const updatedTheme: Theme = {
      ...themes[themeIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    themes[themeIndex] = updatedTheme;
    mockStorage.set(MOCK_KEY, themes);
    return updatedTheme;
  }

  async resetToDefault(): Promise<Theme> {
    const themes = mockStorage.get<Theme[]>(MOCK_KEY, [DEFAULT_THEME]);
    
    // Deactivate all themes
    const updatedThemes = themes.map((t) => ({ ...t, isActive: false }));

    let defaultTheme = updatedThemes.find(
      (t) => t.primaryColor === DEFAULT_THEME.primaryColor && t.name === DEFAULT_THEME.name
    );

    if (!defaultTheme) {
      defaultTheme = { ...DEFAULT_THEME };
      updatedThemes.push(defaultTheme);
    }

    defaultTheme.isActive = true;
    defaultTheme.updatedAt = new Date().toISOString();
    mockStorage.set(MOCK_KEY, updatedThemes);
    return defaultTheme;
  }

  async deleteTheme(themeId: string): Promise<void> {
    const themes = mockStorage.get<Theme[]>(MOCK_KEY, [DEFAULT_THEME]);
    const filtered = themes.filter((t) => t.id !== themeId);
    mockStorage.set(MOCK_KEY, filtered);
  }
}

export const themeService = new ThemeService();
