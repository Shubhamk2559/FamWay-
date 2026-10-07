import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Share, Animated, Alert, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Screen, PageTitle, Flag, IconBtn } from "../components/ui/UIKit";
import { PrimaryButton } from "../components/auth/AuthKit";
import { useAuth } from "../context/AuthContext";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { auth as t } from "../theme/authTheme";

export default function CreateScreen({ navigation }) {
  const { merchant } = useAuth();
  const { createLink } = usePaymentLinks();
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const pop = useRef(new Animated.Value(0)).current;

  const connected = Boolean(merchant && merchant.upiId && merchant.gmailAddress);

  useEffect(() => {
    if (!result) return;
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, stiffness: 180, damping: 14, mass: 1, useNativeDriver: true }).start();
  }, [result, pop]);

  const generate = async () => {
    if (busy) return;
    const rupees = Number(amount);
    if (!amount || rupees < 1) return setError("Enter a valid amount.");
    if (rupees > 500000) return setError("Maximum amount is ₹5,00,000.");
    setError("");
    setBusy(true);
    try {
      const link = await createLink({ amount: rupees, description: description.trim(), customerName: customer.trim() });
      setResult({ url: link.url, amount: rupees.toLocaleString("en-IN"), customer: customer.trim() || "Any customer", description: description.trim() });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setAmount(""); setCustomer(""); setDescription(""); setError(""); setResult(null); setCopied(false);
  };
  const copy = async () => {
    await Clipboard.setStringAsync(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const share = () => Share.share({ message: `Pay ₹${result.amount} here: ${result.url}` });

  const head = (
    <View style={s.head}>
      <PageTitle>{result ? "Link ready" : "Create link"}</PageTitle>
      <View style={s.headRight}>
        <Pressable style={s.pillBtn} onPress={() => navigation.navigate("Links")} hitSlop={8}>
          <Feather name="link" size={18} color="#fff" />
        </Pressable>
        <IconBtn name="help-circle" onPress={() => Alert.alert("Help", "Enter the amount, then tap Generate. Share the link with your customer.")} />
      </View>
    </View>
  );

  if (result) {
    const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
    return (
      <Screen>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {head}
          <Animated.View style={[s.okWrap, { opacity: pop, transform: [{ scale }] }]}>
            <View style={s.ok}>
              <Feather name="check" size={34} color="#fff" />
            </View>
            <Text style={s.okTitle}>Payment link created</Text>
            <Text style={s.okAmount}>₹{result.amount}</Text>
          </Animated.View>

          <View style={s.infoCard}>
            <View style={s.infoRow}><Text style={s.infoL}>Customer</Text><Text style={s.infoV}>{result.customer}</Text></View>
            {result.description ? (
              <View style={[s.infoRow, { marginTop: 14 }]}><Text style={s.infoL}>For</Text><Text style={s.infoV} numberOfLines={2}>{result.description}</Text></View>
            ) : null}
            <View style={[s.infoRow, { marginTop: 14 }]}><Text style={s.infoL}>Status</Text><Text style={[s.infoV, { color: t.green }]}>Active</Text></View>
          </View>

          <View style={s.urlBox}>
            <Text style={s.url} numberOfLines={1}>{result.url}</Text>
            <Pressable onPress={copy} hitSlop={10}>
              <Feather name={copied ? "check" : "copy"} size={18} color="#fff" />
            </Pressable>
          </View>

          <PrimaryButton style={{ marginTop: 22 }} title="Share link" onPress={share} />
          <Pressable style={s.secondary} onPress={copy}>
            <Text style={s.secondaryText}>{copied ? "Copied" : "Copy link"}</Text>
          </Pressable>
          <Pressable style={{ alignSelf: "center", marginTop: 18 }} onPress={reset} hitSlop={10}>
            <Text style={s.again}>Create another</Text>
          </Pressable>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {head}

        <Pressable
          onPress={() => !connected && navigation.navigate("PaymentSettings")}
          style={[s.chip, connected ? s.chipOk : s.chipWarn]}
        >
          <Text style={[s.chipText, { color: connected ? t.green : t.amber }]}>
            {connected ? "Auto-verify is on" : "Connect Gmail to auto-verify"}
          </Text>
          {connected ? null : <Feather name="chevron-right" size={16} color={t.amber} />}
        </Pressable>

        <Text style={s.label}>You collect</Text>
        <View style={s.amountRow}>
          <Pressable style={s.sel} onPress={() => Alert.alert("Currency", "Payments are collected in INR.")}>
            <Flag emoji="🇮🇳" size={28} />
            <Text style={s.selText}>INR</Text>
            <Ionicons name="caret-down" size={14} color="#fff" />
          </Pressable>
          <TextInput
            style={s.amount}
            value={amount}
            onChangeText={(x) => setAmount(x.replace(/[^0-9]/g, ""))}
            placeholder="0"
            placeholderTextColor="#3B3B40"
            keyboardType="numeric"
            maxLength={6}
            selectionColor={t.brand}
            editable={!busy}
            textAlign="right"
          />
        </View>
        <View style={s.line} />

        <Text style={[s.label, { marginTop: 26 }]}>Customer name (optional)</Text>
        <TextInput
          style={s.textInput}
          value={customer}
          onChangeText={setCustomer}
          placeholder="e.g. Rohan Mehta"
          placeholderTextColor="#3B3B40"
          autoCapitalize="words"
          selectionColor={t.brand}
          editable={!busy}
        />
        <View style={s.line} />

        <Text style={[s.label, { marginTop: 26 }]}>Description</Text>
        <TextInput
          style={s.textInput}
          value={description}
          onChangeText={setDescription}
          placeholder="What is this payment for?"
          placeholderTextColor="#3B3B40"
          maxLength={80}
          selectionColor={t.brand}
          editable={!busy}
        />
        <View style={s.line} />

        <View style={s.infoCard}>
          <View style={s.infoRow}><Text style={s.infoL}>Verification</Text><Text style={s.infoV}>Automatic, via payment email</Text></View>
          <View style={[s.infoRow, { marginTop: 18 }]}><Text style={s.infoL}>Each payment expires</Text><Text style={s.infoV}>in 15 minutes</Text></View>
        </View>

        {error ? <Text style={s.err}>{error}</Text> : null}
        <PrimaryButton style={{ marginTop: 26 }} title="Generate link" disabled={!amount} loading={busy} onPress={generate} />

        <Pressable style={s.more} onPress={() => navigation.navigate("Links")}>
          <Text style={s.moreText}>View all payment links</Text>
          <Feather name="chevron-right" size={20} color={t.muted} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40 },
  headRight: { flexDirection: "row", alignItems: "center", gap: 18 },
  pillBtn: { width: 43, height: 35, borderRadius: 18, backgroundColor: t.card, alignItems: "center", justifyContent: "center" },
  chip: { alignSelf: "flex-end", flexDirection: "row", alignItems: "center", gap: 4, marginTop: 18, paddingHorizontal: 16, height: 42, borderRadius: 21 },
  chipOk: { backgroundColor: "#0E2A19" },
  chipWarn: { backgroundColor: "#2B2110" },
  chipText: { fontSize: 14.5, fontWeight: "600" },
  label: { color: t.muted, fontSize: 16, marginTop: 22 },
  amountRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  sel: {
    flexDirection: "row", alignItems: "center", gap: 10, height: 44, paddingHorizontal: 14,
    borderRadius: 22, borderWidth: 1.5, borderColor: "#2C2C30", backgroundColor: "#000",
  },
  selText: { color: "#fff", fontSize: 18, fontWeight: "500" },
  amount: { flex: 1, marginLeft: 14, color: "#fff", fontSize: 32, fontWeight: "600", paddingVertical: 0 },
  line: { height: 1.5, backgroundColor: t.line, marginTop: 14 },
  textInput: { color: "#fff", fontSize: 18, paddingVertical: 0, marginTop: 12, height: 30 },
  infoCard: { backgroundColor: t.card, borderRadius: 16, padding: 18, marginTop: 26 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  infoL: { color: t.muted, fontSize: 15.5 },
  infoV: { color: "#fff", fontSize: 15.5, fontWeight: "600", flexShrink: 1, textAlign: "right" },
  err: { color: t.error, fontSize: 13.5, fontWeight: "500", marginTop: 14 },
  more: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, backgroundColor: t.card, borderRadius: 16, paddingHorizontal: 18, height: 57 },
  moreText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  okWrap: { alignItems: "center", marginTop: 34 },
  ok: { width: 72, height: 72, borderRadius: 36, backgroundColor: t.green, alignItems: "center", justifyContent: "center" },
  okTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginTop: 16 },
  okAmount: { color: "#fff", fontSize: 40, fontWeight: "700", letterSpacing: -1, marginTop: 4 },
  urlBox: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: t.card2, borderRadius: 12, paddingHorizontal: 14, height: 48, marginTop: 14 },
  url: { flex: 1, color: "#fff", fontSize: 14 },
  secondary: { height: 48, borderRadius: 10, backgroundColor: t.card2, alignItems: "center", justifyContent: "center", marginTop: 12 },
  secondaryText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  again: { color: t.muted, fontSize: 15, fontWeight: "500" },
});
