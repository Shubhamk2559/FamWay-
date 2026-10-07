import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, TopBar, PageTitle } from "../components/ui/UIKit";
import { Field, PrimaryButton, ErrorText } from "../components/auth/AuthKit";
import { fetchPaymentSettings, savePaymentSettings } from "../api/settings";
import { useAuth } from "../context/AuthContext";
import { auth as t } from "../theme/authTheme";

export default function PaymentSettingsScreen({ navigation }) {
  const { updateMerchant } = useAuth();
  const [upiId, setUpiId] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const x = await fetchPaymentSettings();
        setUpiId(x.upiId);
        setGmail(x.gmailAddress);
        setHasPassword(x.hasAppPassword);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    if (saving) return;
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const x = await savePaymentSettings({ upiId: upiId.trim(), gmailAddress: gmail.trim(), appPassword: password });
      setHasPassword(x.hasAppPassword);
      setPassword("");
      updateMerchant({ upiId: x.upiId, gmailAddress: x.gmailAddress });
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen bottom>
      <TopBar onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <PageTitle style={{ marginTop: 22 }}>Payment settings</PageTitle>

            <View style={s.note}>
              <Ionicons name="shield-checkmark" size={20} color="#C7C7CC" />
              <Text style={s.noteText}>
                Use a separate Gmail made only for FamPay payment emails. Never use your personal Gmail. Your app
                password is stored encrypted.
              </Text>
            </View>

            <Field style={{ marginTop: 26 }} label="FamPay UPI ID" placeholder="yourname@fam" value={upiId} onChangeText={setUpiId} editable={!saving} />
            <Field style={{ marginTop: 18 }} label="Gmail linked with FamPay" placeholder="yourname@gmail.com" keyboardType="email-address" value={gmail} onChangeText={setGmail} editable={!saving} />
            <Field
              style={{ marginTop: 18 }}
              label="Gmail app password"
              placeholder={hasPassword ? "Saved. Leave blank to keep" : "16-letter app password"}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!saving}
            />

            <ErrorText>{error}</ErrorText>
            {saved ? <Text style={s.ok}>Saved successfully.</Text> : null}
            <PrimaryButton style={{ marginTop: 26 }} title="Save settings" loading={saving} onPress={save} />

            <Text style={s.help}>
              To get an app password: Google Account, Security, turn on 2-Step Verification, then search "App passwords".
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 18, paddingBottom: 30 },
  note: { flexDirection: "row", gap: 12, backgroundColor: t.card, borderRadius: 16, padding: 16, marginTop: 22 },
  noteText: { flex: 1, color: t.muted, fontSize: 13.5, lineHeight: 20 },
  ok: { color: t.green, fontSize: 14, fontWeight: "600", marginTop: 12 },
  help: { color: t.muted, fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 22 },
});
