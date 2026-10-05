import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, dark } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

const sections = [
  {
    title: "Payments",
    items: [
      {
        icon: "qr-code-outline",
        label: "Payment settings",
        screen: "PaymentSettings",
      },
      {
        icon: "card-outline",
        label: "Razorpay",
        note: "Coming soon",
      },
    ],
  },
  {
    title: "Security & settings",
    items: [
      {
        icon: "storefront-outline",
        label: "Business details",
      },
      {
        icon: "shield-checkmark-outline",
        label: "Security",
      },
      {
        icon: "notifications-outline",
        label: "Notifications",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        icon: "help-circle-outline",
        label: "Help & support",
      },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const { merchant: me, logout } = useAuth();

  const merchant = {
    name: me?.name || "",
    businessName: me?.businessName || "Merchant",
    email: me?.email || "",
    phone: me?.phone || "-",
    upiId: me?.upiId || "Not added",
  };

  const info = [
    { label: "Owner", value: merchant.name },
    { label: "Email", value: merchant.email },
    {
      label: "Mobile",
      value: merchant.phone === "-" ? "-" : `+91 ${merchant.phone}`,
    },
    {
      label: "UPI ID",
      value: merchant.upiId,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Account</Text>

        <View style={styles.head}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {merchant.businessName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.biz} numberOfLines={1}>
              {merchant.businessName}
            </Text>

            <Text style={styles.sub} numberOfLines={1}>
              {merchant.email}
            </Text>

            {me?.upiId ? (
              <View style={styles.verified}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#4ADE80"
                />
                <Text style={styles.verifiedText}>
                  UPI linked
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Merchant details
        </Text>

        <View style={styles.group}>
          {info.map((r, i) => (
            <View
              key={r.label}
              style={[
                styles.infoRow,
                i < info.length - 1 && styles.divider,
              ]}
            >
              <Text style={styles.infoLabel}>
                {r.label}
              </Text>

              <Text
                style={styles.infoValue}
                numberOfLines={1}
              >
                {r.value}
              </Text>
            </View>
          ))}
        </View>

        {sections.map((s) => (
          <View key={s.title}>
            <Text style={styles.sectionTitle}>
              {s.title}
            </Text>

            <View style={styles.group}>
              {s.items.map((it, idx) => (
                <Pressable
                  key={it.label}
                  style={[
                    styles.item,
                    idx < s.items.length - 1 && styles.divider,
                  ]}
                  onPress={() =>
                    it.screen &&
                    navigation.navigate(it.screen)
                  }
                >
                  <View style={styles.itemIcon}>
                    <Ionicons
                      name={it.icon}
                      size={19}
                      color={colors.brand}
                    />
                  </View>

                  <Text style={styles.itemText}>
                    {it.label}
                  </Text>

                  {it.note ? (
                    <View style={styles.note}>
                      <Text style={styles.noteText}>
                        {it.note}
                      </Text>
                    </View>
                  ) : null}

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9AA3B5"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable
          style={styles.logout}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={dark.error}
          />

          <Text style={styles.logoutText}>
            Log out
          </Text>
        </Pressable>

        <Text style={styles.version}>
          FamWay Merchant v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: dark.bg,
  },

  scroll: {
    padding: 20,
    paddingBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: dark.text,
    letterSpacing: -0.4,
    marginBottom: 16,
  },

  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: dark.surface,
    borderRadius: 20,
    padding: 18,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: dark.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  biz: {
    fontSize: 18,
    fontWeight: "800",
    color: dark.text,
  },

  sub: {
    fontSize: 13.5,
    color: dark.sub,
    marginTop: 2,
  },

  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(74,222,128,0.14)",
  },

  verifiedText: {
    color: "#4ADE80",
    fontWeight: "700",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: dark.sub,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },

  group: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  infoLabel: {
    fontSize: 14,
    color: colors.muted,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    flexShrink: 1,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: "center",
    justifyContent: "center",
  },

  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  note: {
    backgroundColor: colors.warningBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  noteText: {
    color: colors.warning,
    fontSize: 11.5,
    fontWeight: "700",
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 26,
    height: 50,
    borderRadius: 14,
    backgroundColor: dark.surface,
  },

  logoutText: {
    color: dark.error,
    fontWeight: "700",
    fontSize: 15.5,
  },

  version: {
    textAlign: "center",
    color: dark.sub,
    fontSize: 12,
    marginTop: 18,
  },
});
