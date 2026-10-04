import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { merchant } from "../data/mockData";

const items = [
  { icon: "storefront-outline", label: "Business details" },
  { icon: "qr-code-outline", label: "UPI settings" },
  { icon: "card-outline", label: "Razorpay (coming soon)" },
  { icon: "notifications-outline", label: "Notifications" },
  { icon: "shield-checkmark-outline", label: "Security" },
  { icon: "help-circle-outline", label: "Help & support" },
];

export default function ProfileScreen({ navigation }) {
  const logout = () =>
    navigation.getParent()?.reset({ index: 0, routes: [{ name: "Login" }] });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <LinearGradient
            colors={[colors.brand, colors.brand2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{merchant.businessName.charAt(0)}</Text>
          </LinearGradient>
          <Text style={styles.biz}>{merchant.businessName}</Text>
          <Text style={styles.sub}>{merchant.name}</Text>
          <Text style={styles.sub}>{merchant.email}</Text>
          <View style={styles.upi}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.upiText}>{merchant.upiId}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {items.map((it, idx) => (
            <Pressable
              key={it.label}
              style={[styles.item, idx < items.length - 1 && styles.divider]}
            >
              <View style={styles.itemIcon}>
                <Ionicons name={it.icon} size={20} color={colors.brand} />
              </View>
              <Text style={styles.itemText}>{it.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9aa3b5" />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logout} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        <Text style={styles.version}>FamWay Merchant v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgAlt },
  scroll: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, letterSpacing: -0.5, marginBottom: 16 },
  card: {
    alignItems: "center", backgroundColor: "#fff", borderRadius: 22, padding: 22,
    borderWidth: 1, borderColor: colors.border,
  },
  avatar: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 34, fontWeight: "800" },
  biz: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 14 },
  sub: { fontSize: 14, color: colors.muted, marginTop: 2 },
  upi: {
    flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 999, backgroundColor: colors.successBg,
  },
  upiText: { color: colors.success, fontWeight: "700", fontSize: 13 },
  list: {
    backgroundColor: "#fff", borderRadius: 18, marginTop: 18,
    borderWidth: 1, borderColor: colors.border,
  },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: "#eef0ff",
    alignItems: "center", justifyContent: "center",
  },
  itemText: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.text },
  logout: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18,
    height: 52, borderRadius: 14, backgroundColor: colors.dangerBg,
  },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 16 },
  version: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 20 },
});
