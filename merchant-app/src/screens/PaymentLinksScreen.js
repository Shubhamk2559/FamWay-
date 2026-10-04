import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from "react-native";
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
  const { links, loading, error, refresh } = usePaymentLinks();
  const firstLoad = loading && links.length === 0;

  const subtitle = firstLoad ? "Loading..." : `${links.length} links created`;

  let body;
  if (firstLoad) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator color={dark.accentText} size="large" />
        <Text style={styles.centerText}>Loading your links...</Text>
      </View>
    );
  } else if (error && links.length === 0) {
    body = (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={36} color={dark.sub} />
        <Text style={styles.centerTitle}>Could not load links</Text>
        <Text style={styles.centerText}>{error}</Text>
        <Pressable style={styles.retry} onPress={() => refresh()}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  } else {
    body = (
      <FlatList
        data={links}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <LinkCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => refresh({ silent: true })}
        ListHeaderComponent={
          error ? <Text style={styles.banner}>Could not refresh: {error}</Text> : null
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="link-outline" size={36} color={dark.sub} />
            <Text style={styles.centerTitle}>No payment links yet</Text>
            <Text style={styles.centerText}>Tap + to create your first link.</Text>
          </View>
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader
        title="Payment Links"
        subtitle={subtitle}
        actionIcon="add"
        onAction={() => navigation.navigate("CreateLink")}
      />
      {body}
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
  center: { alignItems: "center", paddingHorizontal: 32, paddingTop: 60, gap: 8 },
  centerTitle: { fontSize: 17, fontWeight: "800", color: dark.text, marginTop: 6 },
  centerText: { fontSize: 14, color: dark.sub, textAlign: "center", lineHeight: 20 },
  retry: {
    marginTop: 12, paddingHorizontal: 22, paddingVertical: 11,
    borderRadius: 12, backgroundColor: dark.accent,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14.5 },
  banner: {
    color: dark.error, fontSize: 13, fontWeight: "600", marginBottom: 4,
  },
});
