import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../src/themes/ThemeProvider";

type RecWorkout = {
  id: string;
  title: string;
  goal: "endurance" | "threshold" | "speed" | "technique" | "mixed";
  estTimeMin: number;
  tags: string[];
};

const RECOMMENDED: RecWorkout[] = [
  { id: "w1", title: "Endurance Builder 1", goal: "endurance", estTimeMin: 45, tags: ["pull", "steady"] },
  { id: "w2", title: "Threshold Ladder", goal: "threshold", estTimeMin: 50, tags: ["main set", "100s"] },
  { id: "w3", title: "Speed Pops", goal: "speed", estTimeMin: 35, tags: ["sprints", "kick"] },
  { id: "w4", title: "Technique Focus", goal: "technique", estTimeMin: 40, tags: ["drills", "form"] },
];

export default function Workouts() {
  const { theme } = useTheme();
  const router = useRouter();

  const Divider = () => (
    <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 16, opacity: 0.8 }} />
  );

  const Chip = ({ label }: { label: string }) => (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: theme.colors.primaryTranslucent,
        marginRight: 6,
      }}
    >
      <Text style={{ color: theme.colors.primary, fontSize: 12 }}>{label}</Text>
    </View>
  );

  const RecCard = ({ item }: { item: RecWorkout }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        // TODO: push to a workout preview screen
        // router.push(`/workout/${item.id}`);
      }}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        <Ionicons name="water-outline" size={18} color={theme.colors.tabIconInactive} />
        <Text style={{ marginLeft: 8, color: theme.colors.text, fontSize: 16, fontWeight: "600" }}>
          {item.title}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Ionicons name="time-outline" size={16} color={theme.colors.tabIconInactive} />
        <Text style={{ marginLeft: 6, color: theme.colors.textSecondary, fontSize: 13 }}>
          ~{item.estTimeMin} min • {ucfirst(item.goal)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {item.tags.map((t) => (
          <Chip key={t} label={t} />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {/* Personalized plan CTA */}
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: 16,
          marginTop: 50,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 6 }}>
          Choose your personalized workout
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 14 }}>
          Answer a few quick questions and get a plan tailored to your goal.
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // TODO: push to questionnaire screen
            // router.push("/plan/quiz");
          }}
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: theme.colors.primary,
          }}
        >
          <Ionicons name="sparkles-outline" size={18} color={theme.colors.primaryContent} />
          <Text style={{ marginLeft: 8, color: theme.colors.primaryContent, fontWeight: "600" }}>
            Start questionnaire
          </Text>
        </TouchableOpacity>
      </View>

      <Divider />

      {/* Build your own */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          router.push("/builder");
        }}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="construct-outline" size={18} color={theme.colors.tabIconInactive} />
          <Text style={{ marginLeft: 8, color: theme.colors.text, fontSize: 15, fontWeight: "600" }}>
            Build your own workout
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.tabIconInactive} />
      </TouchableOpacity>

      <Divider />

      {/* Recommended workouts (static for now) */}
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
        Recommended
      </Text>
      <FlatList
        data={RECOMMENDED}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <RecCard item={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />
    </ScrollView>
  );
}

function ucfirst(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
