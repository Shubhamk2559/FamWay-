import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const map = {
  paid: { bg: colors.successBg, fg: colors.success, label: "Paid" },
  active: { bg: colors.successBg, fg: colors.success, label: "Active" },
  pending: { bg: colors.warningBg, fg: colors.warning, label: "Pending" },
  failed: { bg: colors.dangerBg, fg: colors.danger, label: "Failed" },
  expired: { bg: colors.greyBg, fg: colors.muted, label: "Expired" },
};

export default function StatusBadge({ status }) {
  const s = map[status] || map.pending;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.fg }]} />
      <Text style={[styles.text, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: "700" },
});
