import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import OrderRow from "../components/OrderRow";
import { colors } from "../theme/colors";
import { orders } from "../data/mockData";

const filters = ["all", "paid", "pending", "failed"];

export default function OrdersScreen() {
  const [filter, setFilter] = useState("all");
  const data = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Orders" subtitle="Track every payment" />

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
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <OrderRow order={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgAlt },
  chips: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: "#fff",
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.muted },
  chipTextActive: { color: "#fff" },
  empty: { textAlign: "center", color: colors.muted, marginTop: 40 },
});
