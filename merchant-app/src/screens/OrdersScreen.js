import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import OrderRow from "../components/OrderRow";
import { colors, dark } from "../theme/colors";
import { orders } from "../data/mockData";

const filters = ["all", "paid", "pending", "failed"];

export default function OrdersScreen() {
  const [filter, setFilter] = useState("all");
  const data = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const count = (f) => (f === "all" ? orders.length : orders.filter((o) => o.status === f).length);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Transactions" subtitle="Track every payment" />

      <View style={styles.chips}>
        {filters.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
              <Text style={[styles.chipCount, active && styles.chipTextActive]}>{count(f)}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <OrderRow order={item} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: dark.bg },
  chips: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 13, paddingVertical: 8,
    borderRadius: 999, backgroundColor: dark.surface,
  },
  chipActive: { backgroundColor: "#fff" },
  chipText: { fontSize: 13.5, fontWeight: "700", color: dark.text },
  chipCount: { fontSize: 12.5, fontWeight: "600", color: dark.sub },
  chipTextActive: { color: colors.navy },
  list: {
    flexGrow: 0, marginHorizontal: 20, marginBottom: 16,
    backgroundColor: "#fff", borderRadius: 18,
  },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  empty: { textAlign: "center", color: colors.muted, padding: 32 },
});
