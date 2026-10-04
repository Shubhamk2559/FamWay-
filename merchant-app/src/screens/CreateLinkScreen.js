import { useState } from "react";
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, Share, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import { usePaymentLinks } from "../context/PaymentLinksContext";
import { colors, dark } from "../theme/colors";

export default function CreateLinkScreen({ navigation }) {
  const { createLink } = usePaymentLinks();
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);

  const onAmountChange = (text) => setAmount(text.replace(/[^0-9]/g, ""));

  const generate = async () => {
    if (submitting) return;

    const rupees = Number(amount);
    if (!amount || rupees < 1) {
      setError("Please enter a valid amount.");
      return;
    }
    if (rupees > 500000) {
      setError("Maximum amount is ₹5,00,000.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const customerName = customer.trim();
      const desc = description.trim();
      const link = await createLink({ amount: rupees, description: desc, customerName });

      setResult({
        url: link.url,
        customer: customerName || "Any customer",
        amount: rupees.toLocaleString("en-IN"),
        description: desc,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setCustomer("");
    setAmount("");
    setDescription("");
    setError("");
    setResult(null);
  };

  const share = () => {
    Share.share({
      message: `Pay ₹${result.amount} to complete your payment: ${result.url}`,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Payment Link</Text>
        <View style={styles.backSpacer} />
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
              <View style={styles.amountWrap}>
                <Text style={styles.amountLabel}>Enter amount</Text>
                <View style={[styles.amountRow, amountFocused && styles.amountRowFocused]}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="#4A5C80"
                    keyboardType="numeric"
                    maxLength={8}
                    value={amount}
                    onChangeText={onAmountChange}
                    onFocus={() => setAmountFocused(true)}
                    onBlur={() => setAmountFocused(false)}
                    selectionColor={dark.accentText}
                    editable={!submitting}
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
                  editable={!submitting}
                />
                <Input
                  label="Description"
                  placeholder="What is this payment for?"
                  autoCapitalize="sentences"
                  maxLength={80}
                  value={description}
                  onChangeText={setDescription}
                  editable={!submitting}
                />
              </View>

              <Button title="Generate Payment Link" onPress={generate} loading={submitting} />
            </>
          ) : (
            <View style={styles.card}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={30} color={colors.success} />
              </View>
              <Text style={styles.successTitle}>Payment link created</Text>
              <Text style={styles.successAmount}>₹{result.amount}</Text>
              <Text style={styles.successSub}>
                Saved to your account. You can find it in the Payment Links tab.
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
  safe: { flex: 1, backgroundColor: dark.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  back: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: dark.surface,
    alignItems: "center", justifyContent: "center",
  },
  backSpacer: { width: 42, height: 42 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: dark.text, letterSpacing: -0.3 },
  scroll: { padding: 20, paddingTop: 4, paddingBottom: 32, gap: 18 },
  amountWrap: { alignItems: "center", paddingVertical: 18 },
  amountLabel: { fontSize: 14, fontWeight: "600", color: dark.sub },
  amountRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12,
    paddingBottom: 8, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: dark.line,
    minWidth: 180,
  },
  amountRowFocused: { borderBottomColor: dark.accent },
  rupee: { fontSize: 38, fontWeight: "800", color: dark.sub, marginRight: 6 },
  amountInput: {
    minWidth: 90, fontSize: 52, fontWeight: "800", color: dark.text, padding: 0, letterSpacing: -1,
  },
  error: {
    color: dark.error, fontSize: 13, fontWeight: "600", marginTop: 12, textAlign: "center",
  },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 20 },
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
