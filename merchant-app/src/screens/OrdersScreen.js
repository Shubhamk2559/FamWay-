import { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, RefreshControl, Alert, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Screen, TxRow, STATUS, inr, fmtDate } from "../components/ui/UIKit";
import { useOrders } from "../context/OrdersContext";
import { auth as t } from "../theme/authTheme";

const TABS = [["all", "All"], ["paid", "Paid"], ["pending", "Pending"], ["expired", "Expired"]];

export default function OrdersScreen({ navigation }) {
  const { orders, stats, loading, error, refresh } = useOrders();
  const [tab, setTab] = useState("all");
  const [hidden, setHidden] = useState(false);

  const data = useMemo(() => {
    if (tab === "all") return orders;
    if (tab === "expired") return orders.filter((o) => o.status === "expired" || o.status === "failed");
    if (tab === "pending") return orders.filter((o) => o.status === "pending" || o.status === "created");
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  const detail = (o) =>
    Alert.alert(
      o.number || "Order",
      `Amount: ₹${inr(o.paise)}\nStatus: ${(STATUS[o.status] || {}).label || o.status}\n` +
        (o.utr ? `UTR: ${o.utr}\n` : "") +
        (o.via ? `Verified via: ${o.via}\n` : "") +
        `Created: ${fmtDate(o.createdAt)}`
    );

  const header = (
    <View>
      <View style={s.estRow}>
        <Text style={s.est}>Total collected</Text>
        <Ionicons name="caret-down" size={14} color="#C7C7CC" />
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
          <Feather name={hidden ? "eye-off" : "eye"} size={20} color="#C7C7CC" />
        </Pressable>
      </View>
      <View style={s.balRow}>
        <Text style={s.bal}>{hidden ? "••••" : inr(stats.totalPaise)}</Text>
        <Text style={s.cur}>INR</Text>
        <Ionicons name="caret-down" size={14} color="#D1D1D6" style={{ marginBottom: 12 }} />
      </View>

      <View style={s.btns}>
        <Pressable style={[s.btn, s.btnOn]} onPress={() => navigation.navigate("Create")}>
          <Text style={[s.btnText, { color: t.btnOnText }]}>Create link</Text>
        </Pressable>
        <Pressable style={s.btn} onPress={() => navigation.navigate("Links")}>
          <Text style={s.btnText}>Links</Text>
        </Pressable>
        <Pressable style={s.btn} onPress={() => navigation.navigate("PaymentSettings")}>
          <Text style={s.btnText}>Settings</Text>
        </Pressable>
      </View>

      <View style={s.tabs}>
        {TABS.map(([k, label]) => {
          const on = k === tab;
          return (
            <Pressable key={k} onPress={() => setTab(k)} style={[s.tab, on && s.tabOn]}>
              <Text style={[s.tabText, on && s.tabTextOn]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(o) => o.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <TxRow o={item} divider style={s.row} onPress={() => detail(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refresh({ silent: true })}
            tintColor="#fff"
            colors={["#fff"]}
            progressBackgroundColor={t.card2}
          />
        }
        ListEmptyComponent={
          <Text style={s.empty}>
            {loading ? "Loading..." : error ? "Could not load orders. Pull down to retry." : "No orders here yet."}
          </Text>
        }
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  estRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 52, paddingHorizontal: 18 },
  est: { color: t.muted, fontSize: 15 },
  balRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 6, paddingHorizontal: 18 },
  bal: { color: "#fff", fontSize: 44, fontWeight: "700", letterSpacing: -1 },
  cur: { color: "#D1D1D6", fontSize: 17, fontWeight: "500", marginBottom: 9, marginLeft: 6 },
  btns: { flexDirection: "row", gap: 13, paddingHorizontal: 18, marginTop: 24 },
  btn: { flex: 1, height: 44, borderRadius: 11, backgroundColor: t.card2, alignItems: "center", justifyContent: "center" },
  btnOn: { backgroundColor: t.btnOn },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  tabs: { flexDirection: "row", gap: 30, paddingHorizontal: 18, marginTop: 26, borderBottomWidth: 1, borderBottomColor: t.line },
  tab: { paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: "transparent", marginBottom: -1 },
  tabOn: { borderBottomColor: "#fff" },
  tabText: { color: t.muted, fontSize: 17, fontWeight: "600" },
  tabTextOn: { color: "#fff" },
  row: { paddingHorizontal: 18, paddingVertical: 16 },
  empty: { color: t.muted, textAlign: "center", paddingTop: 50, fontSize: 14.5 },
});
