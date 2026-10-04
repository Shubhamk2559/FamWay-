import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import OrderRow from "../components/OrderRow";
import { colors, shadow } from "../theme/colors";
import { merchant, stats, orders } from "../data/mockData";

const actions = [
  { icon: "add-circle-outline", label: "New Link", screen: "CreateLink" },
  { icon: "qr-code-outline", label: "Show QR" },
  { icon: "share-social-outline", label: "Share" },
  { icon: "download-outline", label: "Reports" },
];

export default function HomeScreen({ navigation }) {
  const recent = orders.slice(0, 4);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View>
            <Text style={styles.hello}>Good day,</Text>
            <Text style={styles.name}>{merchant.businessName}</Text>
          </View>
          <Pressable style={styles.bell} hitSlop={8}>
            <Ionicons name="notifications-outline" size={21} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Total collected</Text>
          <Text style={styles.heroValue}>{stats.totalCollected}</Text>
          <View style={styles.heroDivider} />
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroSmallLabel}>Today's earnings</Text>
              <Text style={styles.heroSmallValue}>{stats.todayCollected}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroSmallLabel}>Pending payments</Text>
              <Text style={styles.heroSmallValue}>{stats.pending}</Text>
            </View>
          </View>
        </View>

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

        <View style={styles.summaryRow}>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Total orders</Text>
            <Text style={styles.summaryValue}>{stats.totalOrders}</Text>
          </View>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Awaiting payment</Text>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{stats.pending}</Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.section}>Recent transactions</Text>
          <Pressable onPress={() => navigation.navigate("Orders")} hitSlop={8}>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          {recent.map((o, i) => (
            <View key={o.id}>
              <OrderRow order={o} />
              {i < recent.length - 1 && <View style={styles.sep} />}
            </View>
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
  name: { fontSize: 21, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  bell: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: "#fff",
    borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center",
  },
  hero: { backgroundColor: colors.navy, borderRadius: 16, padding: 20, ...shadow },
  heroLabel: { color: "#A9B8D3", fontSize: 14 },
  heroValue: { color: "#fff", fontSize: 34, fontWeight: "800", letterSpacing: -0.8, marginTop: 4 },
  heroDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.14)", marginVertical: 16 },
  heroRow: { flexDirection: "row" },
  heroSmallLabel: { color: "#A9B8D3", fontSize: 12.5 },
  heroSmallValue: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 3 },
  actions: {
    flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff",
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 8, marginTop: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  action: { alignItems: "center", width: "25%" },
  actionIcon: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: colors.tint,
    alignItems: "center", justifyContent: "center",
  },
  actionLabel: { fontSize: 12.5, fontWeight: "600", color: colors.text, marginTop: 8 },
  summaryRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  summary: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  summaryLabel: { fontSize: 13, color: colors.muted },
  summaryValue: { fontSize: 24, fontWeight: "800", color: colors.text, marginTop: 4, letterSpacing: -0.4 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 10 },
  section: { fontSize: 17, fontWeight: "800", color: colors.text },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14 },
  listCard: {
    backgroundColor: "#fff", borderRadius: 16, overflow: "hidden",
    borderWidth: 1, borderColor: colors.border,
  },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
});
