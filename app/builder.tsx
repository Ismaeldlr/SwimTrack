// app/builder.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../src/themes/ThemeProvider";

type Stroke = "Free" | "Back" | "Breast" | "Fly";
type Entry = { id: string; distance: number; stroke: Stroke; reps: number };

const DISTANCES = [25, 50, 100, 200, 400, 800] as const;
const STROKES: Stroke[] = ["Free", "Back", "Breast", "Fly"];
const REPS = [1, 2, 3, 4, 5, 10] as const;


export default function Builder() {
  const { theme } = useTheme();
  const router = useRouter();

  const [warmup, setWarmup] = useState<Entry[]>([]);
  const [main, setMain] = useState<Entry[]>([]);
  const [cooldown, setCooldown] = useState<Entry[]>([]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Simple header (custom, since no navbar here) */}
      <View
        style={{
          height: 56,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          marginTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "700", color: theme.colors.text }}>
          Build your workout
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <BlockEditor title="Warm-up" entries={warmup} setEntries={setWarmup} />
        <BlockEditor title="Main" entries={main} setEntries={setMain} />
        <BlockEditor title="Cool-down" entries={cooldown} setEntries={setCooldown} />

        {/* Save/Continue (stub for now) */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // TODO: persist to local DB / preview
            router.back();
          }}
          style={{
            marginTop: 16,
            alignSelf: "stretch",
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: theme.colors.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.primaryContent, fontWeight: "700" }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/** One block with a dashed “+ Add rep” and a 2-step picker (distance → stroke) */
function BlockEditor({
  title,
  entries,
  setEntries,
}: {
  title: string;
  entries: Entry[];
  setEntries: (next: Entry[]) => void;
}) {
  const { theme } = useTheme();
  const [adding, setAdding] = useState<"distance" | "stroke" | "reps" | "customDistance" | "customStroke" | "customReps" | null>(null);
  const [pendingDistance, setPendingDistance] = useState<number | null>(null);
  const [pendingStroke, setPendingStroke] = useState<Stroke | null>(null);
  const [customDistanceInput, setCustomDistanceInput] = useState<string>("");
  const [customStrokeInput, setCustomStrokeInput] = useState<string>("");
  const [customRepsInput, setCustomRepsInput] = useState<string>("");

  function addEntry(distance: number, stroke: Stroke, reps: number) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    setEntries([...entries, { id, distance, stroke, reps }]);
    setAdding(null);
    setPendingDistance(null);
    setPendingStroke(null);
    setCustomDistanceInput("");
    setCustomStrokeInput("");
    setCustomRepsInput("");
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 14,
        marginBottom: 16,
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
        {title}
      </Text>

      {/* Current reps */}
      {entries.length === 0 ? (
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
          No sets yet.
        </Text>
      ) : (
        entries.map((e) => (
          <View
            key={e.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 15 }}>
              {e.reps} x {e.distance} m • {e.stroke}
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  // TODO: edit modal for more in-depth options
                }}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEntries(entries.filter((x) => x.id !== e.id))}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Dashed add box */}
      {adding === null && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setAdding("distance")}
          style={{
            marginTop: 8,
            paddingVertical: 14,
            borderRadius: 12,
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primaryTranslucent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>+ Add set</Text>
        </TouchableOpacity>
      )}

      {/* Step 1: pick distance */}
      {adding === "distance" && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>Choose distance</Text>
          <Wrap>
            {DISTANCES.map((d) => (
              <Chip key={d} label={`${d} m`} onPress={() => { setPendingDistance(d); setAdding("stroke"); }} />
            ))}
            <Chip
              label="Custom"
              onPress={() => {
                setAdding("customDistance");
              }}
            />
          </Wrap>
        </View>
      )}

      {/* Step 2: pick stroke */}
      {adding === "stroke" && pendingDistance != null && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
            Choose stroke • {pendingDistance} m
          </Text>
          <Wrap>
            {STROKES.map((s) => (
              <Chip key={s} label={s} onPress={() => { setPendingStroke(s); setAdding("reps"); }} />
            ))}
            <Chip
              label="Custom"
              onPress={() => {
                setAdding("customStroke");
              }}
            />
            <Chip label="Cancel" onPress={() => { setAdding(null); setPendingDistance(null); }} />
          </Wrap>
        </View>
      )}

      {/* Step 3: pick repetitions */}
      {adding === "reps" && pendingDistance != null && pendingStroke != null && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
            Choose repetitions • {pendingDistance} m • {pendingStroke}
          </Text>
          <Wrap>
            {REPS.map((r) => (
              <Chip key={r} label={`${r}x`} onPress={() => addEntry(pendingDistance, pendingStroke, r)} />
            ))}
            <Chip 
              label="Custom" 
              onPress={() => {
                setAdding("customReps");
              }} 
            />
            <Chip label="Cancel" onPress={() => { setAdding(null); setPendingDistance(null); setPendingStroke(null); }} />
          </Wrap>
        </View>
      )}

      {/* Custom distance input */}
      {adding === "customDistance" && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>Enter custom distance (meters)</Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TextInput
              value={customDistanceInput}
              onChangeText={setCustomDistanceInput}
              placeholder="e.g. 150"
              keyboardType="numeric"
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity
              onPress={() => {
                const distance = parseInt(customDistanceInput);
                if (distance && distance > 0) {
                  setPendingDistance(distance);
                  setAdding("stroke");
                }
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Text style={{ color: theme.colors.primaryContent, fontWeight: "600" }}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setAdding(null); setCustomDistanceInput(""); }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text style={{ color: theme.colors.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Custom stroke input */}
      {adding === "customStroke" && pendingDistance != null && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
            Enter custom stroke • {pendingDistance} m
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TextInput
              value={customStrokeInput}
              onChangeText={setCustomStrokeInput}
              placeholder="e.g. IM, Kick, Pull"
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity
              onPress={() => {
                if (customStrokeInput.trim()) {
                  setPendingStroke(customStrokeInput.trim() as Stroke);
                  setAdding("reps");
                }
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Text style={{ color: theme.colors.primaryContent, fontWeight: "600" }}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setAdding(null); setPendingDistance(null); setCustomStrokeInput(""); }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text style={{ color: theme.colors.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Custom reps input */}
      {adding === "customReps" && pendingDistance != null && pendingStroke != null && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
            Enter custom repetitions • {pendingDistance} m • {pendingStroke}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TextInput
              value={customRepsInput}
              onChangeText={setCustomRepsInput}
              placeholder="e.g. 8"
              keyboardType="numeric"
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity
              onPress={() => {
                const reps = parseInt(customRepsInput);
                if (reps && reps > 0) {
                  addEntry(pendingDistance, pendingStroke, reps);
                }
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Text style={{ color: theme.colors.primaryContent, fontWeight: "600" }}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setAdding(null); setPendingDistance(null); setPendingStroke(null); setCustomRepsInput(""); setCustomStrokeInput(""); }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text style={{ color: theme.colors.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/** Small UI helpers */
function Chip({ label, onPress }: { label: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: theme.colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{children}</View>;
}
