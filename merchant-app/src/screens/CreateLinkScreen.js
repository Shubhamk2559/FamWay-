import { useState } from "react";
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, Share, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { colors } from "../theme/colors";

const makeCode = () => Math.random().toString(36).slice(2, 8);

export default function CreateLinkScreen({ navigation }) {
  const { addLink } = usePaymentLinks();
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [amountFocused, setAmountFocused] = useState(false);

  const onAmountChange = (text) => setAmount(text.replace(/[^0-9]/g, ""));

  const generate = () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");

    const code = makeCode();
    const formattedAmount = Number(amount).toLocaleString("en-IN");
    const customerName = customer.trim();
    const desc = description.trim();

    addLink({
      id: `${Date.now()}`,
      title: desc || customerName || "Payment Link",
      amount: `₹${formattedAmount}`,
      slug: `famway.app/pay/${code}`,
      status: "active",
      payments: 0,
    });

    setResult({
      url: `https://famway.app/pay/${code}`,
      customer: customerName || "Any customer",
      amount: formattedAmount,
      description: desc,
    });
  };

  const reset = () => {
    setCustomer("");
    setAmount("");
    setDescription("");
    setResult(null);
  };

  const share = () => {
    Share.share({
      message: `Pay ₹${result.amount} to complete your payment: ${result.url}`,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Payment Link</Text>
        <View style={styles.back} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!result ? (
            <>
              <View style={styles.amountCard}>
                <Text style={styles.amountLabel}>Amount to collect</Text>
                <View style={[styles.amountRow, amountFocused && styles.amountRowFocused]}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="#B8C0CE"
                    keyboardType="numeric"
                    maxLength={8}
                    value={amount}
                    onChangeText={onAmountChange}
                    onFocus={() => setAmountFocused(true)}
                    onBlur={() => setAmountFocused(false)}
                  />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Customer details</Text>
                <Input
                  label="Customer name (optional)"
                  placeholder="e.g. Rohan Mehta"
                  autoCapitalize="words"
                  value={customer}
                  onChangeText={setCustomer}
                />
                <Input
                  label="Description"
                  placeholder="What is this payment for?"
                  autoCapitalize="sentences"
                  maxLength={80}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <Button title="Generate Payment Link" onPress={generate} />
            </>
          ) : (
            <View style={styles.card}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={30} color={colors.success} />
              </View>
              <Text style={styles.successTitle}>Payment link created</Text>
              <Text style={styles.successAmount}>₹{result.amount}</Text>
              <Text style={styles.successSub}>
                Saved to your Payment Links tab. This is a sample link until the backend is connected.
              </Text>

              <View style={styles.summary}>
                <Row label="Customer" value={result.customer} />
                <Row label="Amount" value={`₹${result.amount}`} />
                {result.description ? <Row label="For" value={result.description} /> : null}
                <Row label="Status" value="Active" />
              </View>

              <View style={styles.urlBox}>
                <Ionicons name="link-outline" size={16} color={colors.brand} />
                <Text style={styles.url} numberOfLines={1}>{result.url}</Text>
              </View>

              <View style={{ gap: 12, marginTop: 20 }}>
                <Button title="Share Link" onPress={share} />
                <Button title="Create Another" variant="outline" onPress={reset} />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgAlt },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  back: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  scroll: { padding: 20, paddingTop: 4, paddingBottom: 32, gap: 16 },
  amountCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  amountLabel: { fontSize: 13, fontWeight: "600", color: colors.muted },
  amountRow: {
    flexDirection: "row", alignItems: "center", marginTop: 8, paddingBottom: 6,
    borderBottomWidth: 2, borderBottomColor: colors.border,
  },
  amountRowFocused: { borderBottomColor: colors.brand },
  rupee: { fontSize: 36, fontWeight: "800", color: colors.text, marginRight: 6 },
  amountInput: { flex: 1, fontSize: 40, fontWeight: "800", color: colors.text, padding: 0, letterSpacing: -1 },
  error: { color: colors.danger, fontSize: 13, fontWeight: "600", marginTop: 10 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 16 },
  successIcon: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: colors.successBg,
    alignItems: "center", justifyContent: "center", alignSelf: "center",
  },
  successTitle: { fontSize: 18, fontWeight: "700", color: colors.text, textAlign: "center", marginTop: 14 },
  successAmount: {
    fontSize: 34, fontWeight: "800", color: colors.text, textAlign: "center",
    marginTop: 4, letterSpacing: -0.8,
  },
  successSub: { fontSize: 13.5, color: colors.muted, textAlign: "center", marginTop: 8, lineHeight: 19 },
  summary: { backgroundColor: colors.bgAlt, borderRadius: 12, padding: 14, marginTop: 20, gap: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  rowLabel: { fontSize: 14, color: colors.muted },
  rowValue: { fontSize: 14, fontWeight: "700", color: colors.text, flexShrink: 1, textAlign: "right" },
  urlBox: {
    flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14, padding: 14,
    borderRadius: 12, backgroundColor: colors.tint,
  },
  url: { flex: 1, color: colors.brand, fontWeight: "700", fontSize: 14 },
});
