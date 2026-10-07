import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Screen, TopBar, PageTitle, MenuRow, soon, securityScore, securityLabel } from "../components/ui/UIKit";
import { useAuth } from "../context/AuthContext";
import { auth as t } from "../theme/authTheme";

const Check = () => <Ionicons name="checkmark-circle" size={24} color={t.green} style={{ marginRight: 12 }} />;

export default function SecurityScreen({ navigation }) {
  const { merchant } = useAuth();
  const m = merchant || {};
  const score = securityScore(m);
  const label = securityLabel(score);
  const labelColor = score >= 4 ? t.green : score === 3 ? t.amber : t.brand;

  return (
    <Screen bottom>
      <TopBar onBack={() => navigation.goBack()} />
      <PageTitle style={s.title}>Security</PageTitle>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#3A3A3E", "#26262A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
          <View style={{ flex: 1 }}>
            <Text style={s.level}>
              Security level: <Text style={{ color: labelColor }}>{label}</Text>
            </Text>
            <Text style={s.desc}>
              {score >= 4 ? "Your account setup is complete." : "Add the missing details below to strengthen your account."}
            </Text>
          </View>
          <View style={s.ring}>
            <View style={[s.ringCircle, { borderColor: labelColor }]} />
            {[-1, 1].flatMap((a) => [-1, 1].map((b) => (
              <View key={`${a}${b}`} style={[s.gap, { left: 50 + a * 34 - 9, top: 50 + b * 34 - 9 }]} />
            )))}
            <View style={s.shield}>
              <Ionicons name="shield-checkmark" size={22} color="#C7C7CC" />
            </View>
          </View>
        </LinearGradient>

        <Text style={s.section}>Account setup</Text>
        <MenuRow icon="mail" label="Email address" right={<Check />} noChevron last={false} onPress={() => navigation.navigate("Account")} />
        <MenuRow
          icon="smartphone"
          label="Phone number"
          right={m.phone ? <Check /> : <Text style={s.add}>Add</Text>}
          noChevron
          onPress={() => (m.phone ? navigation.navigate("Account") : soon("Adding a phone number"))}
        />
        <MenuRow
          icon="credit-card"
          label="UPI ID"
          right={m.upiId ? <Check /> : <Text style={s.add}>Add</Text>}
          noChevron
          onPress={() => navigation.navigate("PaymentSettings")}
        />
        <MenuRow
          icon="inbox"
          label="Payment email"
          right={m.gmailAddress ? <Check /> : <Text style={s.add}>Add</Text>}
          noChevron
          last
          onPress={() => navigation.navigate("PaymentSettings")}
        />

        <Text style={[s.section, { marginTop: 34 }]}>Advanced security</Text>
        <MenuRow icon="key" label="Change password" onPress={() => soon("Change password")} />
        <MenuRow icon="smartphone" label="Devices" onPress={() => soon("Device management")} />
        <MenuRow icon="lock" label="App lock" onPress={() => soon("App lock")} />
        <MenuRow icon="shield" label="Manage account" last onPress={() => navigation.navigate("Account")} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { paddingHorizontal: 18, marginTop: 22 },
  scroll: { paddingHorizontal: 18, paddingTop: 26, paddingBottom: 30 },
  card: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 18, minHeight: 108 },
  level: { color: "#fff", fontSize: 17, fontWeight: "500" },
  desc: { color: t.muted, fontSize: 14.5, lineHeight: 21, marginTop: 8, paddingRight: 8 },
  ring: { width: 100, height: 100 },
  ringCircle: { position: "absolute", left: 4, top: 4, width: 92, height: 92, borderRadius: 46, borderWidth: 4 },
  gap: { position: "absolute", width: 18, height: 18, backgroundColor: "#30302F" },
  shield: { position: "absolute", left: 28, top: 28, width: 44, height: 44, borderRadius: 22, backgroundColor: "#444448", alignItems: "center", justifyContent: "center" },
  section: { color: t.muted, fontSize: 15, marginTop: 26, marginBottom: 6 },
  add: { color: t.muted, fontSize: 15, marginRight: 4 },
});
