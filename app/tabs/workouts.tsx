import { Text, View } from "react-native";
import { useTheme } from "../../src/themes/ThemeProvider";

export default function Workouts() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Workouts</Text>
    </View>
  );
}
