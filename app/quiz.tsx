import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../src/themes/ThemeProvider";

type Goal = "endurance" | "threshold" | "speed" | "technique" | "mixed";
type Experience = "beginner" | "intermediate" | "advanced";
type DaysPerWeek = 2 | 3 | 4 | 5 | 6;
type SessionLen = 30 | 45 | 60 | 75 | 90;
type Intensity = "easy" | "moderate" | "hard";
type StrokeFocus = "free" | "back" | "breast" | "fly" | "mixed";
type Equipment = { paddles: boolean; buoy: boolean; fins: boolean; snorkel: boolean };

export default function PlanQuiz() {
  const { theme } = useTheme();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [days, setDays] = useState<DaysPerWeek | null>(null);
  const [sessionLen, setSessionLen] = useState<SessionLen | null>(null);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [stroke, setStroke] = useState<StrokeFocus | null>(null);
  const [equip, setEquip] = useState<Equipment>({
    paddles: false,
    buoy: false,
    fins: false,
    snorkel: false,
  });

  const canFinish = goal && experience && days && sessionLen && intensity && stroke;

  function onFinish() {
    if (!canFinish) return;
    // TODO: map answers -> pick plan template / generate plan, then navigate to preview
    // For now, just go back:
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Minimal custom header (no navbar) */}
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "700", color: theme.colors.text }}>
          Quick questionnaire
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          alignItems: "center",      // center horizontally
          justifyContent: "center",  // center vertically when content is short
          gap: 18,
          paddingBottom: 40,
        }}
      >
        <Block title="What's your primary goal?">
          <Row>
            <Chip label="Endurance" selected={goal === "endurance"} onPress={() => setGoal("endurance")} />
            <Chip label="Threshold" selected={goal === "threshold"} onPress={() => setGoal("threshold")} />
            <Chip label="Speed" selected={goal === "speed"} onPress={() => setGoal("speed")} />
            <Chip label="Technique" selected={goal === "technique"} onPress={() => setGoal("technique")} />
            <Chip label="Mixed" selected={goal === "mixed"} onPress={() => setGoal("mixed")} />
          </Row>
        </Block>

        <Block title="How experienced are you?">
          <Row>
            <Chip label="Beginner" selected={experience === "beginner"} onPress={() => setExperience("beginner")} />
            <Chip label="Intermediate" selected={experience === "intermediate"} onPress={() => setExperience("intermediate")} />
            <Chip label="Advanced" selected={experience === "advanced"} onPress={() => setExperience("advanced")} />
          </Row>
        </Block>

        <Block title="How many days per week can you swim?">
          <Row>
            {[2, 3, 4, 5, 6].map((d) => (
              <Chip key={d} label={`${d}`} selected={days === d} onPress={() => setDays(d as DaysPerWeek)} />
            ))}
          </Row>
        </Block>

        <Block title="Typical session length?">
          <Row>
            {[30, 45, 60, 75, 90].map((m) => (
              <Chip key={m} label={`${m} min`} selected={sessionLen === m} onPress={() => setSessionLen(m as SessionLen)} />
            ))}
          </Row>
        </Block>

        <Block title="Preferred intensity right now?">
          <Row>
            <Chip label="Easy" selected={intensity === "easy"} onPress={() => setIntensity("easy")} />
            <Chip label="Moderate" selected={intensity === "moderate"} onPress={() => setIntensity("moderate")} />
            <Chip label="Hard" selected={intensity === "hard"} onPress={() => setIntensity("hard")} />
          </Row>
        </Block>

        <Block title="Stroke focus?">
          <Row>
            <Chip label="Free" selected={stroke === "free"} onPress={() => setStroke("free")} />
            <Chip label="Back" selected={stroke === "back"} onPress={() => setStroke("back")} />
            <Chip label="Breast" selected={stroke === "breast"} onPress={() => setStroke("breast")} />
            <Chip label="Fly" selected={stroke === "fly"} onPress={() => setStroke("fly")} />
            <Chip label="Mixed" selected={stroke === "mixed"} onPress={() => setStroke("mixed")} />
          </Row>
        </Block>

        <Block title="Do you have any equipment?">
          <Row>
            <Toggle label="Paddles" value={equip.paddles} onChange={(v) => setEquip({ ...equip, paddles: v })} />
            <Toggle label="Pull Buoy" value={equip.buoy} onChange={(v) => setEquip({ ...equip, buoy: v })} />
            <Toggle label="Fins" value={equip.fins} onChange={(v) => setEquip({ ...equip, fins: v })} />
            <Toggle label="Snorkel" value={equip.snorkel} onChange={(v) => setEquip({ ...equip, snorkel: v })} />
          </Row>
        </Block>

        {/* Finish button */}
        <TouchableOpacity
          disabled={!canFinish}
          onPress={onFinish}
          activeOpacity={0.9}
          style={{
            marginTop: 6,
            alignSelf: "center",
            paddingVertical: 14,
            paddingHorizontal: 22,
            borderRadius: 12,
            backgroundColor: canFinish ? theme.colors.primary : theme.colors.primaryTranslucent,
          }}
        >
          <Text style={{ color: theme.colors.primaryContent, fontWeight: "700" }}>
            {canFinish ? "See my plan" : "Answer the questions"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- UI helpers (centered look) ---------- */

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 520,
        alignItems: "center", // center the contents
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 14,
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12, textAlign: "center" }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
      {children}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: selected ? theme.colors.primary : theme.colors.border,
        backgroundColor: selected ? theme.colors.primaryTranslucent : theme.colors.surface,
        minWidth: 88,
        alignItems: "center",
      }}
    >
      <Text style={{ color: selected ? theme.colors.primary : theme.colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      activeOpacity={0.85}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: value ? theme.colors.primary : theme.colors.border,
        backgroundColor: value ? theme.colors.primaryTranslucent : theme.colors.surface,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      <Ionicons
        name={value ? "checkbox-outline" : "square-outline"}
        size={18}
        color={value ? theme.colors.primary : theme.colors.tabIconInactive}
      />
      <Text style={{ marginLeft: 8, color: theme.colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}
