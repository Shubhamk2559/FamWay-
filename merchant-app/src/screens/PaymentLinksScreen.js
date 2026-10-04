import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import StatusBadge from "../components/StatusBadge";
import { colors } from "../theme/colors";
import { links } from "../data/mockData";

function LinkCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Ionicons name="link" size={20} color={colors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.urlBox}>
        <Text style={styles.url} numberOfLines={1}>{item.slug}</Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.meta}>{item.payments} payments</Text>
        <View style={styles.btns}>
          <Pressable style={styles.small}>
            <Ionicons name="copy-outline" size={16} color={colors.brand} />
            <Text style={styles.smallText}>Copy</Text>
          </Pressable>
          <Pressable style={styles.small}>
            <Ionicons name="share-social-outline" size={16} color={colors.brand} />
            <Text style={styles.smallText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function PaymentLinksScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader
        title="Payment Links"
        subtitle={`${links.length} links created`}
        actionIcon="add"
        onAction={() => {}}
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
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: "#eef0ff",
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  amount: { fontSize: 14, color: colors.muted, marginTop: 2 },
  urlBox: { backgroundColor: colors.bgAlt, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 14 },
  url: { fontSize: 13, color: colors.muted },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  meta: { fontSize: 13, color: colors.muted },
  btns: { flexDirection: "row", gap: 8 },
  small: {
    flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12,
    paddingVertical: 7, borderRadius: 10, backgroundColor: "#eef0ff",
  },
  smallText: { color: colors.brand, fontWeight: "700", fontSize: 13 },
});
