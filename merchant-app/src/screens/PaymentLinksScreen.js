import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import StatusBadge from "../components/StatusBadge";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { colors, dark } from "../theme/colors";

function LinkCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Ionicons name="link" size={20} color={colors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.meta}>{item.payments} payments</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <Text style={styles.amount}>{item.amount}</Text>
          <StatusBadge status={item.status} />
        </View>
      </View>

      <View style={styles.urlBox}>
        <Text style={styles.url} numberOfLines={1}>{item.slug}</Text>
      </View>

      <View style={styles.btns}>
        <Pressable style={[styles.small, { flex: 1 }]}>
          <Ionicons name="copy-outline" size={16} color={colors.brand} />
          <Text style={styles.smallText}>Copy</Text>
        </Pressable>
        <Pressable style={[styles.small, styles.smallFilled, { flex: 1 }]}>
          <Ionicons name="share-social-outline" size={16} color="#fff" />
          <Text style={[styles.smallText, { color: "#fff" }]}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function PaymentLinksScreen({ navigation }) {
  const { links } = usePaymentLinks();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader
        title="Payment Links"
        subtitle={`${links.length} links created`}
        actionIcon="add"
        onAction={() => navigation.navigate("CreateLink")}
      />
      <FlatList
        data={links}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <LinkCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: dark.bg },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.tint,
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "700", color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  amount: { fontSize: 17, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  urlBox: {
    backgroundColor: colors.bgAlt, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, marginTop: 14,
  },
  url: { fontSize: 13, color: colors.muted },
  btns: { flexDirection: "row", gap: 10, marginTop: 14 },
  small: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 10, borderRadius: 12, backgroundColor: colors.tint,
  },
  smallFilled: { backgroundColor: colors.brand },
  smallText: { color: colors.brand, fontWeight: "700", fontSize: 13.5 },
});
