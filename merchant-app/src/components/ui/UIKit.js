import { useEffect, useState } from "react";
import { View, Text, Pressable, Keyboard, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { auth as t } from "../../theme/authTheme";

export const soon = (what) => Alert.alert("Coming soon", `${what} is coming soon.`);

const p2 = (n) => String(n).padStart(2, "0");
export const fmtDate = (v) => {
  const d = new Date(v);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
};
export const inr = (paise) =>
  (Number(paise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const maskEmail = (e = "") => {
  const [l, d] = String(e).split("@");
  return d ? `${l.slice(0, 3)}****@${d}` : e;
};
export const securityScore = (m) =>
  1 + (m && m.phone ? 1 : 0) + (m && m.upiId ? 1 : 0) + (m && m.gmailAddress ? 1 : 0);
export const securityLabel = (n) => (n >= 4 ? "High" : n === 3 ? "Medium" : "Basic");

export const STATUS = {
  paid: { label: "Paid", color: t.green, icon: "check" },
  pending: { label: "Pending", color: t.amber, icon: "clock" },
  created: { label: "Pending", color: t.amber, icon: "clock" },
  expired: { label: "Expired", color: t.brand, icon: "x" },
  failed: { label: "Failed", color: t.brand, icon: "x" },
};

export function useKeyboardVisible() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const a = Keyboard.addListener("keyboardDidShow", () => setV(true));
    const b = Keyboard.addListener("keyboardDidHide", () => setV(false));
    return () => { a.remove(); b.remove(); };
  }, []);
  return v;
}

export function Screen({ children, bottom = false }) {
  return (
    <SafeAreaView edges={bottom ? ["top", "bottom"] : ["top"]} style={s.screen}>
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
}

export function TopBar({ onBack, right }) {
  return (
    <View style={s.top}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={16}>
          <Feather name="arrow-left" size={26} color="#E6E6E8" />
        </Pressable>
      ) : (
        <View />
      )}
      <View style={s.topRight}>{right}</View>
    </View>
  );
}

export function IconBtn({ name, onPress, size = 24 }) {
  return (
    <Pressable onPress={onPress} hitSlop={12}>
      <Feather name={name} size={size} color="#FFFFFF" />
    </Pressable>
  );
}

export const PageTitle = ({ children, style }) => <Text style={[s.title, style]}>{children}</Text>;

export function Flag({ emoji, size = 27 }) {
  return (
    <View style={[s.flag, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ fontSize: size * 1.25, lineHeight: size * 1.5, includeFontPadding: false }}>{emoji}</Text>
    </View>
  );
}

export function Avatar({ size = 62, flag }) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons name="person" size={size * 0.62} color="#8E8E93" style={{ marginTop: size * 0.14 }} />
      </View>
      {flag ? (
        <View style={s.avBadge}>
          <Flag emoji={flag} size={Math.round(size * 0.36)} />
        </View>
      ) : null}
    </View>
  );
}

export function MenuRow({ icon, label, value, valueColor, right, last, onPress, noChevron }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.menu, !last && s.menuLine, pressed && { opacity: 0.6 }]}
    >
      {icon ? <Feather name={icon} size={22} color="#fff" style={s.menuIcon} /> : null}
      <Text style={s.menuLabel}>{label}</Text>
      {value ? <Text style={[s.menuValue, valueColor && { color: valueColor }]}>{value}</Text> : null}
      {right}
      {noChevron ? null : <Feather name="chevron-right" size={20} color="#fff" />}
    </Pressable>
  );
}

export function TxRow({ o, divider, onPress, style }) {
  const st = STATUS[o.status] || STATUS.pending;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.tx, divider && s.txLine, style, pressed && { opacity: 0.7 }]}
    >
      <View style={s.txIcon}>
        <Feather name={st.icon} size={18} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.txTitle} numberOfLines={1}>{o.title}</Text>
        <Text style={s.txSub} numberOfLines={1}>{fmtDate(o.paidAt || o.createdAt)}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={s.txAmt}>{o.status === "paid" ? "+" : ""}₹{inr(o.paise)}</Text>
        <Text style={[s.txStatus, { color: st.color }]}>{st.label}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.bg },
  top: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 18, paddingTop: 26, height: 52,
  },
  topRight: { flexDirection: "row", alignItems: "center", gap: 22 },
  title: { color: t.text, fontSize: 26, fontWeight: "700" },
  flag: { overflow: "hidden", backgroundColor: "#333", alignItems: "center", justifyContent: "center" },
  avatar: { backgroundColor: "#2E2E32", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  avBadge: { position: "absolute", right: -3, bottom: -3, borderRadius: 20, borderWidth: 2, borderColor: t.bg, overflow: "hidden" },
  menu: { flexDirection: "row", alignItems: "center", minHeight: 62 },
  menuLine: { borderBottomWidth: 1.5, borderBottomColor: t.line },
  menuIcon: { width: 28, marginRight: 14 },
  menuLabel: { flex: 1, color: t.text, fontSize: 16, fontWeight: "500" },
  menuValue: { color: t.muted, fontSize: 15, marginRight: 6 },
  tx: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  txLine: { borderBottomWidth: 1.5, borderBottomColor: t.line },
  txIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: t.card2, alignItems: "center", justifyContent: "center" },
  txTitle: { color: t.text, fontSize: 16, fontWeight: "500" },
  txSub: { color: t.muted, fontSize: 13, marginTop: 3 },
  txAmt: { color: t.text, fontSize: 16, fontWeight: "500" },
  txStatus: { fontSize: 14.5, marginTop: 3, fontWeight: "500" },
});
