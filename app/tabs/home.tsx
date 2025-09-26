import { Text, View } from "react-native";
import { useTheme } from "../../assets/themes/ThemeProvider";



export default function Home() {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
            <Text style={{ color: theme.colors.text }}>Home</Text>
        </View>
    );
}
