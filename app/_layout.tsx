import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDb } from "../src/db";
import { ThemeProvider } from "../src/themes/ThemeProvider";

export default function RootLayout() {
  
  useEffect(() => {
    initDb().catch((e) => console.error("DB init failed", e));
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
