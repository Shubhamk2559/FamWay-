import { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Alert, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, TopBar, PageTitle, soon } from "../components/ui/UIKit";
import { APP_VERSION } from "../config";
import { auth as t } from "../theme/authTheme";

function Row({ label, value, onPress }) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <Text style={s.rowLabel}>{label}</Text>
      {value ? <Text style={s.rowValue}>{value}</Text> : null}
      <Feather name="chevron-right" size={20} color="#fff" />
    </Pressable>
  );
}

export default function AboutScreen({ navigation }) {
  const [rating, setRating] = useState(0);

  return (
    <Screen bottom>
      <TopBar onBack={() => navigation.goBack()} />
      <PageTitle style={s.title}>About us</PageTitle>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.icon}>
          <Image source={require("../../assets/logo-icon.png")} style={s.iconImg} resizeMode="contain" tintColor="#fff" />
        </View>
        <Text style={s.version}>Version {APP_VERSION}</Text>

        <View style={s.card}>
          <Text style={s.q}>Would you recommend FamWay to friends?</Text>
          <View style={s.scale}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <Pressable key={n} style={[s.cell, n > 1 && s.cellLine, rating === n && s.cellOn]} onPress={() => setRating(n)}>
                <Text style={[s.cellText, rating === n && { color: "#000" }]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.hints}>
            <Text style={s.hint}>{rating ? "Thanks for your feedback!" : "Not now"}</Text>
            <Text style={s.hint}>Of course!</Text>
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Row label="App upgrade" value={`v ${APP_VERSION}`} onPress={() => Alert.alert("App upgrade", "You are on the latest version.")} />
          <Row label="Privacy Policy" onPress={() => soon("Privacy Policy")} />
          <Row label="Terms & Conditions" onPress={() => soon("Terms & Conditions")} />
          <Row label="Clear cache" onPress={() => Alert.alert("Clear cache", "Nothing to clear.")} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { paddingHorizontal: 18, marginTop: 22 },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  icon: { width: 70, height: 70, borderRadius: 18, backgroundColor: t.brand, alignSelf: "center", alignItems: "center", justifyContent: "center", marginTop: 52 },
  iconImg: { width: 44, height: 42 },
  version: { color: t.muted, fontSize: 16, textAlign: "center", marginTop: 14 },
  card: { backgroundColor: t.card, borderRadius: 16, padding: 18, marginTop: 40 },
  q: { color: "#fff", fontSize: 17, fontWeight: "500" },
  scale: { flexDirection: "row", marginTop: 18, height: 46, borderRadius: 9, borderWidth: 1.5, borderColor: "#2C2C30", overflow: "hidden" },
  cell: { flex: 1, alignItems: "center", justifyContent: "center" },
  cellLine: { borderLeftWidth: 1.5, borderLeftColor: "#2C2C30" },
  cellOn: { backgroundColor: "#fff" },
  cellText: { color: "#fff", fontSize: 15 },
  hints: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  hint: { color: t.muted, fontSize: 14 },
  row: { flexDirection: "row", alignItems: "center", height: 55, paddingHorizontal: 18 },
  rowLabel: { flex: 1, color: "#fff", fontSize: 17, fontWeight: "500" },
  rowValue: { color: t.muted, fontSize: 16, marginRight: 8 },
});
