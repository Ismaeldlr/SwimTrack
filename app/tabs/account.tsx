import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../assets/themes/ThemeProvider";


export default function Account() {
  const { scheme, theme, toggleTheme } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 12 }}>
        Account
      </Text>

      <TouchableOpacity
        onPress={toggleTheme}
        activeOpacity={0.9}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
          backgroundColor: theme.colors.primaryTranslucent,
        }}
      >
        <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
          Switch to {scheme === "light" ? "Dark" : "Light"} Mode
        </Text>
      </TouchableOpacity>
    </View>
  );
}
