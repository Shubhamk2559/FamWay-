import { View, Text, StyleSheet } from "react-native";
import StatusBadge from "./StatusBadge";
import { colors } from "../theme/colors";

export default function OrderRow({ order }) {
  const initial = order.customer.charAt(0).toUpperCase();
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{order.customer}</Text>
        <Text style={styles.meta} numberOfLines={1}>{order.id} · {order.date}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{order.amount}</Text>
        <StatusBadge status={order.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: "#fff" },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tint,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: colors.brand, fontWeight: "800", fontSize: 15 },
  name: { fontSize: 15, fontWeight: "700", color: colors.text },
  meta: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
  right: { alignItems: "flex-end", gap: 5 },
  amount: { fontSize: 15, fontWeight: "800", color: colors.text },
});
