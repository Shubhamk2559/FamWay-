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
        <Text style={styles.name}>{order.customer}</Text>
        <Text style={styles.meta}>{order.id} · {order.date}</Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <Text style={styles.amount}>{order.amount}</Text>
        <StatusBadge status={order.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff",
    padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: "#eef0ff",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: colors.brand, fontWeight: "800", fontSize: 16 },
  name: { fontSize: 15, fontWeight: "700", color: colors.text },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "800", color: colors.text },
});
