import { useState } from "react";
import {
  View, Text, ScrollView, Pressable, Image, FlatList, RefreshControl, StyleSheet, useWindowDimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Screen, Avatar, TxRow, inr, soon } from "../components/ui/UIKit";
import { useOrders } from "../context/OrdersContext";
import { auth as t } from "../theme/authTheme";

const ACTIONS = [
  { icon: "plus", label: "Create link", go: "Create", primary: true },
  { icon: "file-text", label: "Orders", go: "Orders" },
  { icon: "credit-card", label: "Payments", go: "PaymentSettings" },
  { icon: "more-horizontal", label: "More", go: "Profile" },
];

const SLIDES = [
  { a: "Collect with UPI QR", b: "Payments verify automatically", go: "Create" },
  { a: "Share links anywhere", b: "WhatsApp, SMS or email in one tap", go: "Links" },
  { a: "Auto-verify from Gmail", b: "Connect your FamPay email once", go: "PaymentSettings" },
];

function Promo({ navigation }) {
  const { width } = useWindowDimensions();
  const w = width - 36;
  const [i, setI] = useState(0);
  return (
    <View style={s.promo}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={SLIDES}
        keyExtractor={(x) => x.a}
        getItemLayout={(_, k) => ({ length: w, offset: w * k, index: k })}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / w))}
        renderItem={({ item }) => (
          <Pressable style={{ width: w, paddingHorizontal: 18, paddingTop: 24 }} onPress={() => navigation.navigate(item.go)}>
            <Text style={s.promoA}>{item.a}</Text>
            <Text style={s.promoB}>{item.b}</Text>
          </Pressable>
        )}
      />
      <Image source={require("../../assets/logo-icon.png")} style={s.promoLogo} resizeMode="contain" />
      <View style={s.dots} pointerEvents="none">
        {SLIDES.map((x, k) => (
          <View key={x.a} style={[s.dot, k === i && s.dotOn]} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { orders, stats, loading, error, refresh } = useOrders();
  const [hidden, setHidden] = useState(false);
  const recent = orders.slice(0, 4);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refresh({ silent: true })}
            tintColor="#fff"
            colors={["#fff"]}
            progressBackgroundColor={t.card2}
          />
        }
      >
        <View style={s.top}>
          <Pressable onPress={() => navigation.navigate("Profile")} hitSlop={8}>
            <Avatar size={33} />
          </Pressable>
          <View style={s.brandWrap} pointerEvents="none">
            <Image source={require("../../assets/logo-wordmark.png")} style={s.brand} resizeMode="contain" />
          </View>
          <View style={s.icons}>
            <Pressable onPress={() => soon("QR scanner")} hitSlop={10}>
              <Feather name="maximize" size={22} color="#fff" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Orders")} hitSlop={10}>
              <Feather name="bell" size={22} color="#fff" />
              {stats.pendingCount > 0 ? <View style={s.dotRed} /> : null}
            </Pressable>
            <Pressable onPress={() => soon("Support chat")} hitSlop={10}>
              <Feather name="headphones" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>

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
        <Text style={s.today}>
          {hidden ? "Today ••••" : `Today +₹${inr(stats.todayPaise)}`}  ·  {stats.pendingCount} pending
        </Text>

        <View style={s.actions}>
          {ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [s.action, pressed && { opacity: 0.7 }]}
              onPress={() => navigation.navigate(a.go)}
            >
              <View style={[s.circle, a.primary && s.circleOn]}>
                <Feather name={a.icon} size={26} color={a.primary ? "#000" : "#fff"} />
              </View>
              <Text style={s.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <Promo navigation={navigation} />

        <View style={s.txCard}>
          <View style={s.txHead}>
            <Text style={s.txHeadText}>Transactions</Text>
            <Pressable onPress={() => navigation.navigate("Orders")} hitSlop={12}>
              <Feather name="more-horizontal" size={22} color={t.muted} />
            </Pressable>
          </View>
          {recent.length ? (
            recent.map((o) => <TxRow key={o.id} o={o} onPress={() => navigation.navigate("Orders")} />)
          ) : (
            <Text style={s.empty}>
              {loading ? "Loading..." : error ? "Could not load transactions. Pull down to retry." : "No transactions yet. Create a link to get started."}
            </Text>
          )}
        </View>

        <Pressable style={({ pressed }) => [s.widgets, pressed && { opacity: 0.7 }]} onPress={() => navigation.navigate("Create")}>
          <Feather name="plus" size={20} color="#fff" />
          <Text style={s.widgetsText}>New payment link</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 18, paddingBottom: 28 },
  top: { height: 52, marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  brand: { width: 82, height: 25 },
  icons: { flexDirection: "row", alignItems: "center", gap: 18 },
  dotRed: { position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF1F1F" },
  estRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 28 },
  est: { color: t.muted, fontSize: 15 },
  balRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 6 },
  bal: { color: "#fff", fontSize: 44, fontWeight: "700", letterSpacing: -1 },
  cur: { color: "#D1D1D6", fontSize: 17, fontWeight: "500", marginBottom: 9, marginLeft: 6 },
  today: { color: t.muted, fontSize: 14, marginTop: 4 },
  actions: { flexDirection: "row", marginTop: 26, marginHorizontal: -18 },
  action: { flex: 1, alignItems: "center" },
  circle: { width: 52, height: 52, borderRadius: 26, backgroundColor: t.card2, alignItems: "center", justifyContent: "center" },
  circleOn: { backgroundColor: "#fff" },
  actionLabel: { color: "#fff", fontSize: 15, marginTop: 10 },
  promo: { marginTop: 22, height: 103, borderRadius: 16, backgroundColor: t.card2, overflow: "hidden" },
  promoA: { color: t.muted, fontSize: 16 },
  promoB: { color: "#fff", fontSize: 17, fontWeight: "500", marginTop: 6, maxWidth: 210 },
  promoLogo: { position: "absolute", right: 22, top: 20, width: 62, height: 58, transform: [{ rotate: "-8deg" }] },
  dots: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#55555A" },
  dotOn: { backgroundColor: "#fff" },
  txCard: { marginTop: 18, backgroundColor: t.card, borderRadius: 16, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  txHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  txHeadText: { color: "#fff", fontSize: 17, fontWeight: "500" },
  empty: { color: t.muted, fontSize: 14, paddingVertical: 22, textAlign: "center", lineHeight: 20 },
  widgets: {
    alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, marginTop: 26,
    height: 40, paddingHorizontal: 22, borderRadius: 20, borderWidth: 1.5, borderColor: "#2C2C30", backgroundColor: "#000",
  },
  widgetsText: { color: "#fff", fontSize: 16 },
});
