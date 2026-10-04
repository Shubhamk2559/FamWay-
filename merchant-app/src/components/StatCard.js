import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function StatCard({ icon, label, value }) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={20} color={colors.brand} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  icon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: "#eef0ff",
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  value: { fontSize: 20, fontWeight: "800", color: colors.text, letterSpacing: -0.4 },
  label: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
