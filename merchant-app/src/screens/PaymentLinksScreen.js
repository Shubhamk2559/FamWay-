import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import Input from "../components/Input";
import Button from "../components/Button";
import { fetchPaymentSettings, savePaymentSettings } from "../api/settings";
import { useAuth } from "../context/AuthContext";
import { colors, dark } from "../theme/colors";

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
        const s = await fetchPaymentSettings();

        setUpiId(s.upiId || "");
        setGmail(s.gmailAddress || "");
        setHasPassword(Boolean(s.hasAppPassword));
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
      const s = await savePaymentSettings({
        upiId: upiId.trim(),
        gmailAddress: gmail.trim(),
        appPassword: password,
      });

      setHasPassword(s.hasAppPassword);
      setPassword("");

      updateMerchant({
        upiId: s.upiId,
        gmailAddress: s.gmailAddress,
      });

      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.back}
          hitSlop={8}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={dark.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Payment settings
        </Text>

        <View style={styles.back} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            color={dark.accentText}
            size="large"
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.warn}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={dark.accentText}
              />

              <Text style={styles.warnText}>
                Use a separate Gmail made only for FamWay payment emails.
                Your app password is stored encrypted.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Receiving account
              </Text>

              <Input
                label="FamWay UPI ID"
                placeholder="yourname@fam"
                value={upiId}
                onChangeText={setUpiId}
                editable={!saving}
              />

              <Text style={[styles.cardTitle, { marginTop: 8 }]}>
                Payment email
              </Text>

              <Input
                label="Gmail linked with FamWay"
                placeholder="yourname@gmail.com"
                keyboardType="email-address"
                value={gmail}
                onChangeText={setGmail}
                editable={!saving}
              />

              <Input
                label="Gmail app password"
                placeholder={
                  hasPassword
                    ? "Saved. Leave blank to keep"
                    : "16-letter app password"
                }
                secure
                value={password}
                onChangeText={setPassword}
                editable={!saving}
              />

              {error ? (
                <Text style={styles.error}>
                  {error}
                </Text>
              ) : null}

              {saved ? (
                <Text style={styles.ok}>
                  Saved successfully.
                </Text>
              ) : null}

              <Button
                title="Save settings"
                onPress={save}
                loading={saving}
              />
            </View>

            <Text style={styles.help}>
              To get an app password: Google Account → Security →
              Turn on 2-Step Verification → App passwords.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: dark.bg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: dark.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: dark.text,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },

  warn: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: dark.surface,
    borderRadius: 16,
    padding: 14,
  },

  warnText: {
    flex: 1,
    color: dark.sub,
    fontSize: 13,
    lineHeight: 19,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 14,
  },

  error: {
    color: colors.danger,
    fontSize: 13.5,
    fontWeight: "600",
    marginBottom: 14,
  },

  ok: {
    color: colors.success,
    fontSize: 13.5,
    fontWeight: "700",
    marginBottom: 14,
  },

  help: {
    color: dark.sub,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: "center",
  },
});
