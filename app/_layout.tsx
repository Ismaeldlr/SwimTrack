import { Stack } from "expo-router";
import { ThemeProvider } from "../assets/themes/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
