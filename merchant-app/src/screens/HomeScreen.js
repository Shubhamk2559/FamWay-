import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import OrderRow from "../components/OrderRow";
import { dark } from "../theme/colors";
import { merchant, stats, orders } from "../data/mockData";

const actions = [
  { icon: "add", label: "Create Link", screen: "CreateLink" },
  { icon: "qr-code-outline", label: "QR" },
  { icon: "arrow-down-outline", label: "Withdraw" },
  { icon: "document-text-outline", label: "Reports" },
];

export default function HomeScreen({ navigation }) {
  const recent = orders.slice(0, 4);
  const paidCount = orders.filter((o) => o.status === "paid").length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{merchant.businessName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>Welcome back</Text>
            <Text style={styles.name} numberOfLines={1}>{merchant.businessName}</Text>
          </View>
          <Pressable style={styles.bell} hitSlop={8}>
            <Ionicons name="notifications-outline" size={20} color={dark.text} />
          </Pressable>
        </View>

        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Total collected</Text>
          <Text style={styles.balanceValue}>{stats.totalCollected}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={styles.balanceTag}>
                <Ionicons name="trending-up" size={14} color="#fff" />
                <Text style={styles.balanceTagText}>Today's earning</Text>
              </View>
              <Text style={styles.balanceSmall}>{stats.todayCollected}</Text>
            </View>
            <View style={styles.balanceItem}>
              <View style={styles.balanceTag}>
                <Ionicons name="time-outline" size={14} color="#fff" />
                <Text style={styles.balanceTagText}>Pending</Text>
              </View>
              <Text style={styles.balanceSmall}>{stats.pending} payments</Text>
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
                <Ionicons name={a.icon} size={22} color={dark.text} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Merchant activity</Text>
        <View style={styles.activity}>
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{stats.totalOrders}</Text>
            <Text style={styles.activityLabel}>Total orders</Text>
          </View>
          <View style={styles.activityLine} />
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{paidCount}</Text>
            <Text style={styles.activityLabel}>Paid recently</Text>
          </View>
          <View style={styles.activityLine} />
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{stats.pending}</Text>
            <Text style={styles.activityLabel}>Awaiting</Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={[styles.section, { marginTop: 0, marginBottom: 0 }]}>Recent transactions</Text>
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
  safe: { flex: 1, backgroundColor: dark.bg },
  scroll: { padding: 20, paddingBottom: 32 },
  top: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: dark.accent,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  hello: { fontSize: 13, color: dark.sub },
  name: { fontSize: 18, fontWeight: "800", color: dark.text, letterSpacing: -0.2 },
  bell: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: dark.surface,
    alignItems: "center", justifyContent: "center",
  },
  balance: { backgroundColor: dark.accent, borderRadius: 22, padding: 22 },
  balanceLabel: { color: "rgba(255,255,255,0.78)", fontSize: 14 },
  balanceValue: { color: "#fff", fontSize: 40, fontWeight: "800", letterSpacing: -1, marginTop: 6 },
  balanceRow: {
    flexDirection: "row", marginTop: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.2)",
  },
  balanceItem: { flex: 1 },
  balanceTag: { flexDirection: "row", alignItems: "center", gap: 6 },
  balanceTagText: { color: "rgba(255,255,255,0.78)", fontSize: 12.5 },
  balanceSmall: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 5 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
  action: { alignItems: "center", width: "25%" },
  actionIcon: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: dark.surface2,
    alignItems: "center", justifyContent: "center",
  },
  actionLabel: { fontSize: 12, fontWeight: "600", color: dark.sub, marginTop: 8 },
  section: { fontSize: 17, fontWeight: "800", color: dark.text, marginTop: 26, marginBottom: 12 },
  activity: {
    flexDirection: "row", alignItems: "center", backgroundColor: dark.surface,
    borderRadius: 18, paddingVertical: 18,
  },
  activityItem: { flex: 1, alignItems: "center" },
  activityValue: { fontSize: 22, fontWeight: "800", color: dark.text },
  activityLabel: { fontSize: 12.5, color: dark.sub, marginTop: 3 },
  activityLine: { width: 1, height: 34, backgroundColor: dark.line },
  sectionHead: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 26, marginBottom: 12,
  },
  link: { color: dark.accentText, fontWeight: "700", fontSize: 14 },
  listCard: { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden" },
  sep: { height: 1, backgroundColor: "#E3E8EF", marginLeft: 68 },
});
