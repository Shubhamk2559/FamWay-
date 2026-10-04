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
      <Text style={[styles.text, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  text: { fontSize: 12, fontWeight: "700" },
});
