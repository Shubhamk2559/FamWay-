import { useState } from "react";
import { View, Text, FlatList, Pressable, Share, RefreshControl, ActivityIndicator, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { Screen, PageTitle } from "../components/ui/UIKit";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { auth as t } from "../theme/authTheme";

function LinkCard({ item }) {
  const [copied, setCopied] = useState(false);
  const active = item.status === "active";

  const copy = async () => {
    await Clipboard.setStringAsync(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const share = () => Share.share({ message: `Pay ${item.amount} here: ${item.url}` });

  return (
    <View style={s.card}>
      <View style={s.row}>
        <View style={s.icon}>
          <Feather name="link" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={1}>{item.title}</Text>
          <Text style={s.sub}>{item.payments} payments</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={s.amount}>{item.amount}</Text>
          <Text style={[s.status, { color: active ? t.green : t.brand }]}>{active ? "Active" : "Expired"}</Text>
        </View>
      </View>

      <View style={s.urlBox}>
        <Text style={s.url} numberOfLines={1}>{item.slug}</Text>
      </View>

      <View style={s.btns}>
        <Pressable style={({ pressed }) => [s.btn, s.btnDark, pressed && { opacity: 0.75 }]} onPress={copy}>
          <Feather name={copied ? "check" : "copy"} size={16} color="#fff" />
          <Text style={s.btnText}>{copied ? "Copied" : "Copy"}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [s.btn, s.btnLight, pressed && { opacity: 0.75 }]} onPress={share}>
          <Feather name="share" size={16} color="#1C1C1E" />
          <Text style={[s.btnText, { color: "#1C1C1E" }]}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function PaymentLinksScreen({ navigation }) {
  const { links, loading, error, refresh } = usePaymentLinks();
  const first = loading && links.length === 0;

  return (
    <Screen>
      <View style={s.head}>
        <PageTitle>Payment links</PageTitle>
        <Pressable style={s.plus} onPress={() => navigation.navigate("Create")} hitSlop={8}>
          <Feather name="plus" size={22} color="#fff" />
        </Pressable>
      </View>

      {first ? (
        <View style={s.center}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <FlatList
          data={links}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <LinkCard item={item} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refresh({ silent: true })}
              tintColor="#fff"
              colors={["#fff"]}
              progressBackgroundColor={t.card2}
            />
          }
          ListHeaderComponent={error ? <Text style={s.err}>Could not refresh: {error}</Text> : null}
          ListEmptyComponent={
            <View style={s.center}>
              <Feather name="link" size={34} color={t.muted} />
              <Text style={s.emptyTitle}>No payment links yet</Text>
              <Text style={s.emptyText}>Tap + to create your first link.</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, marginTop: 40, marginBottom: 18 },
  plus: { width: 40, height: 40, borderRadius: 20, backgroundColor: t.card2, alignItems: "center", justifyContent: "center" },
  list: { paddingHorizontal: 18, paddingBottom: 24, gap: 12 },
  card: { backgroundColor: t.card, borderRadius: 16, padding: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: t.card2, alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 16, fontWeight: "500" },
  sub: { color: t.muted, fontSize: 13, marginTop: 3 },
  amount: { color: "#fff", fontSize: 16, fontWeight: "600" },
  status: { fontSize: 14, marginTop: 3, fontWeight: "500" },
  urlBox: { backgroundColor: t.card2, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, marginTop: 14 },
  url: { color: t.muted, fontSize: 13 },
  btns: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: { flex: 1, height: 42, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  btnDark: { backgroundColor: t.card2 },
  btnLight: { backgroundColor: t.btnOn },
  btnText: { color: "#fff", fontSize: 14.5, fontWeight: "600" },
  center: { alignItems: "center", paddingTop: 70, gap: 8 },
  emptyTitle: { color: "#fff", fontSize: 17, fontWeight: "600", marginTop: 6 },
  emptyText: { color: t.muted, fontSize: 14 },
  err: { color: t.error, fontSize: 13, marginBottom: 6 },
});
