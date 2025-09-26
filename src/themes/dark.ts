// Dark theme — deep slate with bluish highlights
export const darkTheme = {
  name: "dark",
  colors: {
    // App surfaces
    background: "#0B1220",     // deep navy
    surface: "#0F172A",        // slate-900
    card: "#111827",           // gray-900
    border: "#334155",         // slate-700

    // Text
    text: "#E5E7EB",           // gray-200
    textSecondary: "#CBD5E1",  // slate-300
    muted: "#94A3B8",          // slate-400

    // Brand / accent
    primary: "#60A5FA",        // blue-400 (brighter on dark)
    primaryContent: "#0B1220",
    primaryTranslucent: "rgba(59,130,246,0.20)", // blue-500 @ 20%

    // Tabs / navbar
    // Slightly deeper translucent blue so it reads on dark bg
    tabBarBackground: "rgba(30,58,138,0.35)", // indigo-800 @ 35%
    tabIconActive: "#60A5FA",
    tabIconInactive: "#94A3B8",
    tabLabelActive: "#60A5FA",
    tabLabelInactive: "#94A3B8",

    // Floating center button
    fabBackground: "rgba(59, 131, 246, 1)",  // blue-500 @ 25%
    fabBackgroundActive: "#60A5FA",
    fabIcon: "#ffffffff",
    fabIconActive: "#0B1220",

    // Inputs
    inputBackground: "#111827",
    inputPlaceholder: "#94A3B8",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
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
    // Keep subtle on dark to avoid gray glow
    color: "#000000",
    opacity: 0.35,
    radius: 8,
    offset: { width: 0, height: 3 },
    elevation: 8,
  },
} as const;

export type DarkTheme = typeof darkTheme;
