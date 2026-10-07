import { useState } from "react";
import { View, Text, ScrollView, Pressable, Share, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import {
  Screen, TopBar, IconBtn, Avatar, MenuRow, soon, securityScore,
} from "../components/ui/UIKit";
import { useAuth } from "../context/AuthContext";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { APP_VERSION } from "../config";
import { auth as t } from "../theme/authTheme";

function Bars({ n }) {
  return (
    <View style={s.bars}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[s.bar, { backgroundColor: i < n ? t.green : "#3A3A3F" }]} />
      ))}
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { merchant } = useAuth();
  const { links } = usePaymentLinks();
  const m = merchant || {};
  const connected = Boolean(m.upiId && m.gmailAddress);
  const score = securityScore(m);
  const [copied, setCopied] = useState(false);
  const uid = String(m._id || "").slice(-8).toUpperCase();

  const copy = async () => {
    await Clipboard.setStringAsync(String(m._id || ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Screen bottom>
      <TopBar
        onBack={() => navigation.goBack()}
        right={
          <>
            <IconBtn name="headphones" onPress={() => soon("Support chat")} />
            <IconBtn name="settings" onPress={() => navigation.navigate("Settings")} />
          </>
        }
      />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Pressable style={s.head} onPress={() => navigation.navigate("Account")}>
          <Avatar size={62} flag="🇮🇳" />
          <View style={{ flex: 1 }}>
            <Text style={s.name} numberOfLines={1}>{m.businessName || "Merchant"}</Text>
            <Pressable style={s.uidRow} onPress={copy} hitSlop={8}>
              <Text style={s.uid}>ID: {uid}</Text>
              <Feather name={copied ? "check" : "copy"} size={14} color={t.muted} />
            </Pressable>
            <View style={s.badges}>
              <View style={[s.badge, { backgroundColor: m.upiId ? t.greenBg : "#2B2B30" }]}>
                <Text style={[s.badgeText, { color: m.upiId ? t.green : t.muted }]}>{m.upiId ? "UPI linked" : "No UPI"}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: connected ? t.greenBg : "#2B2B30" }]}>
                <Text style={[s.badgeText, { color: connected ? t.green : t.muted }]}>{connected ? "Auto-verify" : "Manual"}</Text>
              </View>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={t.muted} />
        </Pressable>

        <View style={s.cardOuter}>
          <View style={s.card}>
            <View style={s.cardIcon}>
              <Feather name="mail" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Auto-verify payments</Text>
              <Text style={s.cardText}>
                {connected ? "Payments are confirmed from your FamPay email." : "Connect your FamPay Gmail to confirm payments automatically."}
              </Text>
            </View>
            <Pressable style={s.cardBtn} onPress={() => navigation.navigate("PaymentSettings")}>
              <Text style={s.cardBtnText}>{connected ? "Manage" : "Set up"}</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 22 }}>
          <MenuRow icon="link" label="Payment links" value={String(links.length)} onPress={() => navigation.navigate("Links")} />
          <MenuRow icon="lock" label="Security" right={<Bars n={score} />} onPress={() => navigation.navigate("Security")} />
          <MenuRow icon="credit-card" label="Payment settings" onPress={() => navigation.navigate("PaymentSettings")} />
          <MenuRow icon="message-circle" label="Community" onPress={() => soon("Community")} />
          <MenuRow
            icon="share"
            label="Share"
            onPress={() => Share.share({ message: "Collect UPI payments easily with FamWay." })}
          />
          <MenuRow icon="alert-circle" label="About us" value={`V${APP_VERSION}`} last onPress={() => navigation.navigate("About")} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  head: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 24 },
  name: { color: "#fff", fontSize: 18, fontWeight: "500" },
  uidRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5, alignSelf: "flex-start" },
  uid: { color: t.muted, fontSize: 15 },
  badges: { flexDirection: "row", gap: 8, marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  badgeText: { fontSize: 14, fontWeight: "500" },
  cardOuter: { marginTop: 26, borderWidth: 1.5, borderColor: "#3A3A3F", borderRadius: 18, padding: 3 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: t.card2, borderRadius: 15, padding: 14 },
  cardIcon: { width: 46, height: 46, borderRadius: 11, backgroundColor: t.brand, alignItems: "center", justifyContent: "center" },
  cardTitle: { color: "#fff", fontSize: 16.5, fontWeight: "600" },
  cardText: { color: t.muted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  cardBtn: { backgroundColor: "#000", borderRadius: 22, paddingHorizontal: 16, height: 40, alignItems: "center", justifyContent: "center" },
  cardBtnText: { color: "#fff", fontSize: 14.5, fontWeight: "500" },
  bars: { flexDirection: "row", gap: 4, marginRight: 12 },
  bar: { width: 3, height: 14, borderRadius: 2 },
});
