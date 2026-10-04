import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { merchant } from "../data/mockData";

const sections = [
  {
    title: "Payments",
    items: [
      { icon: "qr-code-outline", label: "UPI settings" },
      { icon: "card-outline", label: "Razorpay", note: "Coming soon" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "storefront-outline", label: "Business details" },
      { icon: "notifications-outline", label: "Notifications" },
      { icon: "shield-checkmark-outline", label: "Security" },
    ],
  },
  {
    title: "Support",
    items: [{ icon: "help-circle-outline", label: "Help & support" }],
  },
];

const info = [
  { label: "Owner", value: merchant.name },
  { label: "Email", value: merchant.email },
  { label: "Mobile", value: `+91 ${merchant.phone}` },
  { label: "UPI ID", value: merchant.upiId },
];

export default function ProfileScreen({ navigation }) {
  const logout = () =>
    navigation.getParent()?.reset({ index: 0, routes: [{ name: "Login" }] });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.head}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{merchant.businessName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.biz} numberOfLines={1}>{merchant.businessName}</Text>
            <Text style={styles.sub} numberOfLines={1}>{merchant.email}</Text>
            <View style={styles.verified}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.verifiedText}>UPI linked</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Business information</Text>
        <View style={styles.group}>
          {info.map((r, i) => (
            <View key={r.label} style={[styles.infoRow, i < info.length - 1 && styles.divider]}>
              <Text style={styles.infoLabel}>{r.label}</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{r.value}</Text>
            </View>
          ))}
        </View>

        {sections.map((s) => (
          <View key={s.title}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <View style={styles.group}>
              {s.items.map((it, idx) => (
                <Pressable
                  key={it.label}
                  style={[styles.item, idx < s.items.length - 1 && styles.divider]}
                >
                  <View style={styles.itemIcon}>
                    <Ionicons name={it.icon} size={19} color={colors.brand} />
                  </View>
                  <Text style={styles.itemText}>{it.label}</Text>
                  {it.note ? (
                    <View style={styles.note}>
                      <Text style={styles.noteText}>{it.note}</Text>
                    </View>
                  ) : null}
                  <Ionicons name="chevron-forward" size={18} color="#9AA3B5" />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

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
  title: { fontSize: 24, fontWeight: "800", color: colors.text, letterSpacing: -0.4, marginBottom: 16 },
  head: {
    flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#fff",
    borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: colors.navy,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 26, fontWeight: "800" },
  biz: { fontSize: 18, fontWeight: "800", color: colors.text },
  sub: { fontSize: 13.5, color: colors.muted, marginTop: 2 },
  verified: {
    flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start",
    marginTop: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: colors.successBg,
  },
  verifiedText: { color: colors.success, fontWeight: "700", fontSize: 12 },
  sectionTitle: {
    fontSize: 13, fontWeight: "700", color: colors.muted, textTransform: "uppercase",
    letterSpacing: 0.6, marginTop: 24, marginBottom: 8, marginLeft: 4,
  },
  group: {
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    overflow: "hidden",
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    gap: 16, paddingVertical: 14, paddingHorizontal: 16,
  },
  infoLabel: { fontSize: 14, color: colors.muted },
  infoValue: { fontSize: 14, fontWeight: "700", color: colors.text, flexShrink: 1 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.tint,
    alignItems: "center", justifyContent: "center",
  },
  itemText: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.text },
  note: { backgroundColor: colors.warningBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  noteText: { color: colors.warning, fontSize: 11.5, fontWeight: "700" },
  logout: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24,
    height: 50, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#F1C9C6",
  },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 15.5 },
  version: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 18 },
});
