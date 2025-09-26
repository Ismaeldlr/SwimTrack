// Light theme — soft, bluish accents (same vibe as your tab bar)
export const lightTheme = {
  name: "light",
  colors: {
    // App surfaces
    background: "#FFFFFF",
    surface: "#F8FAFC",       // slate-50
    card: "#FFFFFF",
    border: "#E2E8F0",        // slate-200

    // Text
    text: "#0F172A",          // slate-900
    textSecondary: "#475569", // slate-600
    muted: "#94A3B8",         // slate-400

    // Brand / accent
    primary: "#3B82F6",       // blue-500
    primaryContent: "#FFFFFF",
    primaryTranslucent: "rgba(96,165,250,0.15)", // blue-400 @ 15%

    // Tabs / navbar
    tabBarBackground: "rgba(96,165,250,0.15)", // light blue, not full opacity
    tabIconActive: "#3B82F6",
    tabIconInactive: "#64748B", // slate-500
    tabLabelActive: "#3B82F6",
    tabLabelInactive: "#64748B",

    // Floating center button
    fabBackground: "rgba(96, 165, 250, 1)",
    fabBackgroundActive: "#3B82F6",
    fabIcon: "#000000ff",
    fabIconActive: "#FFFFFF",

    // Inputs
    inputBackground: "#FFFFFF",
    inputPlaceholder: "#94A3B8",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16, // used by the center button
    xl: 20,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  shadow: {
    // Soft iOS-ish shadow for light mode
    color: "#000000",
    opacity: 0.12,
    radius: 6,
    offset: { width: 0, height: 3 },
    elevation: 6, // Android
  },
} as const;

export type LightTheme = typeof lightTheme;
