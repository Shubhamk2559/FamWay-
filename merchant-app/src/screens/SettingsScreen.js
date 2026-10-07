import { View, Text, ScrollView, Pressable, Alert, Linking, StyleSheet } from "react-native";
import { Screen, TopBar, PageTitle, MenuRow, Flag } from "../components/ui/UIKit";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import { auth as t } from "../theme/authTheme";

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();

  const diagnose = async () => {
    const t0 = Date.now();
    try {
      const r = await fetch(`${API_BASE_URL}/health`);
      const j = await r.json();
      Alert.alert("Network diagnostics", `Server: ${j.status}\nDatabase: ${j.db}\nResponse: ${Date.now() - t0} ms`);
    } catch (_e) {
      Alert.alert("Network diagnostics", "Cannot reach the server. Check your internet.");
    }
  };

  return (
    <Screen bottom>
      <TopBar onBack={() => navigation.goBack()} />
      <PageTitle style={s.title}>Settings</PageTitle>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <MenuRow
          icon="dollar-sign"
          label="Currency"
          right={<View style={s.cur}><Flag emoji="🇮🇳" size={26} /><Text style={s.curText}>INR</Text></View>}
          onPress={() => Alert.alert("Currency", "Payments are collected in INR.")}
        />
        <MenuRow icon="globe" label="Language" value="English" onPress={() => Alert.alert("Language", "More languages are coming soon.")} />
        <MenuRow icon="sun" label="Appearance" value="Dark" onPress={() => Alert.alert("Appearance", "FamWay uses the dark theme.")} />
        <MenuRow icon="bell" label="Marketing preferences" onPress={() => Alert.alert("Marketing preferences", "You will only receive payment alerts.")} />
        <MenuRow icon="settings" label="Permissions" onPress={() => Linking.openSettings()} />
        <MenuRow icon="wifi" label="Network diagnostics" last onPress={diagnose} />
      </ScrollView>
      <View style={s.footer}>
        <Pressable style={({ pressed }) => [s.logout, pressed && { opacity: 0.8 }]} onPress={logout}>
          <Text style={s.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { paddingHorizontal: 18, marginTop: 22 },
  scroll: { paddingHorizontal: 18, paddingTop: 22 },
  cur: { flexDirection: "row", alignItems: "center", gap: 8, marginRight: 8 },
  curText: { color: t.muted, fontSize: 16 },
  footer: { paddingHorizontal: 18, paddingBottom: 12 },
  logout: { height: 48, borderRadius: 10, backgroundColor: t.card2, alignItems: "center", justifyContent: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
