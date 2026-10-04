import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import StatCard from "../components/StatCard";
import OrderRow from "../components/OrderRow";
import { colors } from "../theme/colors";
import { merchant, stats, orders } from "../data/mockData";

const actions = [
  { icon: "add-circle-outline", label: "New Link", screen: "CreateLink" },
  { icon: "qr-code-outline", label: "Show QR" },
  { icon: "share-social-outline", label: "Share" },
  { icon: "download-outline", label: "Reports" },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View>
            <Text style={styles.hello}>Good day,</Text>
            <Text style={styles.name}>{merchant.businessName}</Text>
          </View>
          <Pressable style={styles.bell} hitSlop={8}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <LinearGradient
          colors={[colors.navy, colors.navy2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroLabel}>Total collected</Text>
          <Text style={styles.heroValue}>{stats.totalCollected}</Text>
          <View style={styles.heroRow}>
            <View style={styles.today}>
              <Ionicons name="trending-up" size={14} color="#7dd3fc" />
              <Text style={styles.todayText}>{stats.todayCollected} today</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.actions}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              style={styles.action}
              onPress={() => a.screen && navigation.navigate(a.screen)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={a.icon} size={22} color={colors.brand} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.statRow}>
          <StatCard icon="receipt-outline" label="Total orders" value={stats.totalOrders} />
          <StatCard icon="time-outline" label="Pending" value={stats.pending} />
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.section}>Recent orders</Text>
          <Pressable onPress={() => navigation.navigate("Orders")}>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </View>

        <View style={{ gap: 10 }}>
          {orders.slice(0, 4).map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgAlt },
  scroll: { padding: 20, paddingBottom: 32 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  hello: { fontSize: 14, color: colors.muted },
  name: { fontSize: 22, fontWeight: "800", color: colors.text, letterSpacing: -0.4 },
  bell: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: "#fff",
    borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center",
  },
  hero: { borderRadius: 22, padding: 22 },
  heroLabel: { color: "#b6c2e0", fontSize: 14 },
  heroValue: { color: "#fff", fontSize: 36, fontWeight: "800", letterSpacing: -1, marginTop: 4 },
  heroRow: { flexDirection: "row", marginTop: 14 },
  today: {
    flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)",
  },
  todayText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
  action: { alignItems: "center", width: "23%" },
  actionIcon: {
    width: 56, height: 56, borderRadius: 18, backgroundColor: "#fff", borderWidth: 1,
    borderColor: colors.border, alignItems: "center", justifyContent: "center",
  },
  actionLabel: { fontSize: 12.5, fontWeight: "600", color: colors.text, marginTop: 8 },
  statRow: { flexDirection: "row", gap: 12, marginTop: 22 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 26, marginBottom: 12 },
  section: { fontSize: 18, fontWeight: "800", color: colors.text },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14 },
});
