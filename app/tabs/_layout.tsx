import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../assets/themes/ThemeProvider";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.tabIconActive,
        tabBarInactiveTintColor: theme.colors.tabIconInactive,
        tabBarStyle: {
          position: "absolute",
          height: 64,
          paddingBottom: Platform.select({ ios: 10, android: 8 }),
          paddingTop: 8,
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 12 },
        sceneStyle: {
          backgroundColor: theme.colors.background, // screens get themed bg
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Center floating Start button */}
      <Tabs.Screen
        name="start"
        options={{
          title: "Start",
          tabBarLabel: "Start",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="add"
              size={22}
              color={focused ? theme.colors.fabIconActive : theme.colors.fabIcon}
            />
          ),
          tabBarButton: (props) => <CenterButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function CenterButton({ accessibilityState, onPress, style }: BottomTabBarButtonProps) {
  const { theme } = useTheme();
  const focused = Boolean(accessibilityState?.selected);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.centerWrap, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View
        style={[
          styles.centerBtn,
          { backgroundColor: theme.colors.fabBackground },
          focused && { backgroundColor: theme.colors.fabBackgroundActive },
        ]}
      >
        <Ionicons
          name="add"
          size={24}
          color={focused ? theme.colors.fabIconActive : theme.colors.fabIcon}
        />
      </View>
      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color: focused ? theme.colors.tabLabelActive : theme.colors.tabLabelInactive,
        }}
      >
        Start
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  centerWrap: { alignItems: "center", justifyContent: "center", top: -35 },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
