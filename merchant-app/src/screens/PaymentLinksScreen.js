import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import StatusBadge from "../components/StatusBadge";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { colors, shadow } from "../theme/colors";

function LinkCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.amount}>{item.amount}</Text>

      <View style={styles.urlBox}>
        <Ionicons name="link-outline" size={16} color={colors.muted} />
        <Text style={styles.url} numberOfLines={1}>{item.slug}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.count}>
          <Ionicons name="checkmark-done-outline" size={16} color={colors.muted} />
          <Text style={styles.meta}>{item.payments} payments</Text>
        </View>
        <View style={styles.btns}>
          <Pressable style={styles.small}>
            <Ionicons name="copy-outline" size={16} color={colors.brand} />
            <Text style={styles.smallText}>Copy</Text>
          </Pressable>
          <Pressable style={[styles.small, styles.smallFilled]}>
            <Ionicons name="share-social-outline" size={16} color="#fff" />
            <Text style={[styles.smallText, { color: "#fff" }]}>Share</Text>
          </Pressable>
        </View>
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
  safe: { flex: 1, backgroundColor: colors.bgAlt },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border, ...shadow,
  },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  title: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },
  amount: { fontSize: 26, fontWeight: "800", color: colors.text, letterSpacing: -0.5, marginTop: 8 },
  urlBox: {
    flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.bgAlt,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 14,
  },
  url: { flex: 1, fontSize: 13, color: colors.muted },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  count: { flexDirection: "row", alignItems: "center", gap: 6 },
  meta: { fontSize: 13, color: colors.muted },
  btns: { flexDirection: "row", gap: 8 },
  small: {
    flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 10, backgroundColor: colors.tint,
  },
  smallFilled: { backgroundColor: colors.brand },
  smallText: { color: colors.brand, fontWeight: "700", fontSize: 13 },
});
