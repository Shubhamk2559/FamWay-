import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { Screen, TopBar, Avatar, maskEmail, soon } from "../components/ui/UIKit";
import { useAuth } from "../context/AuthContext";
import { auth as t } from "../theme/authTheme";

export default function AccountScreen({ navigation }) {
  const { merchant } = useAuth();
  const m = merchant || {};
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(String(m._id || ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Row = ({ label, value, right, last }) => (
    <View style={[s.row, !last && { marginBottom: 22 }]}>
      <Text style={s.label}>{label}</Text>
      <View style={s.valueWrap}>
        <Text style={s.value} numberOfLines={1}>{value}</Text>
        {right}
      </View>
    </View>
  );

  return (
    <Screen bottom>
      <TopBar onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.avatarWrap}>
          <Avatar size={66} />
          <Pressable style={s.edit} onPress={() => soon("Profile photo")}>
            <Feather name="edit-2" size={12} color="#fff" />
          </Pressable>
        </View>
        <Text style={s.email}>{maskEmail(m.email)}</Text>

        <View style={s.card}>
          <Row
            label="Merchant ID"
            value={String(m._id || "").slice(-10).toUpperCase()}
            right={
              <Pressable onPress={copy} hitSlop={10}>
                <Feather name={copied ? "check" : "copy"} size={18} color="#fff" />
              </Pressable>
            }
          />
          <Row label="Business name" value={m.businessName || "-"} />
          <Row label="Owner" value={m.name || "-"} />
          <Row label="Mobile" value={m.phone ? `+91 ${m.phone}` : "Not added"} />
          <Row label="UPI ID" value={m.upiId || "Not added"} last />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  avatarWrap: { alignSelf: "center", marginTop: 40 },
  edit: {
    position: "absolute", right: -2, bottom: -2, width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#000", borderWidth: 1.5, borderColor: "#2C2C30", alignItems: "center", justifyContent: "center",
  },
  email: { color: "#fff", fontSize: 22, fontWeight: "500", textAlign: "center", marginTop: 20 },
  card: { backgroundColor: t.card, borderRadius: 18, padding: 18, paddingTop: 22, marginTop: 38 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
  label: { color: "#fff", fontSize: 17, fontWeight: "500" },
  valueWrap: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  value: { color: "#E5E5EA", fontSize: 16, flexShrink: 1 },
});
