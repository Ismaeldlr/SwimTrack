import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export type Theme = typeof lightTheme | typeof darkTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

// Helper to pick a theme by color scheme string
export const getTheme = (scheme?: "light" | "dark" | null): Theme =>
  scheme === "dark" ? darkTheme : lightTheme;
