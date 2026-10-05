import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    businessName: "", name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    if (!form.businessName.trim() || !form.name.trim()) return "Business name and your name are required.";
    if (!EMAIL_RE.test(form.email.trim())) return "Enter a valid email.";
    if (form.phone && !/^\d{10}$/.test(form.phone)) return "Mobile number must be 10 digits.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return "";
  };

  const submit = async () => {
    if (loading) return;
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({
        businessName: form.businessName.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone,
        password: form.password,
      });
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>

          <View style={{ marginTop: 16 }}>
            <Logo size={44} />
          </View>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.sub}>Start collecting payments in minutes.</Text>

          <View style={{ marginTop: 24 }}>
            <Input label="Business name" placeholder="Aarav Stores" autoCapitalize="words" value={form.businessName} onChangeText={set("businessName")} editable={!loading} />
            <Input label="Your name" placeholder="Full name" autoCapitalize="words" value={form.name} onChangeText={set("name")} editable={!loading} />
            <Input label="Email" placeholder="you@business.com" keyboardType="email-address" value={form.email} onChangeText={set("email")} editable={!loading} />
            <Input label="Mobile number" placeholder="10-digit number" keyboardType="phone-pad" maxLength={10} value={form.phone} onChangeText={set("phone")} editable={!loading} />
            <Input label="Password" placeholder="Minimum 8 characters" secure value={form.password} onChangeText={set("password")} editable={!loading} />
            <Input label="Confirm password" placeholder="Re-enter password" secure value={form.confirm} onChangeText={set("confirm")} editable={!loading} />

            <Text style={styles.terms}>
              By creating an account you agree to FamWay's <Text style={styles.link}>Terms</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Create Account" onPress={submit} loading={loading} />
          </View>

          <View style={styles.bottom}>
            <Text style={styles.muted}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 32 },
  back: { color: colors.brand, fontSize: 16, fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginTop: 28, letterSpacing: -0.5 },
  sub: { fontSize: 15, color: colors.muted, marginTop: 6 },
  terms: { fontSize: 12.5, color: colors.muted, lineHeight: 18, marginBottom: 16 },
  error: { color: colors.danger, fontSize: 13.5, fontWeight: "600", marginBottom: 14 },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14 },
  muted: { color: colors.muted, fontSize: 14 },
  bottom: { flexDirection: "row", justifyContent: "center", paddingTop: 28 },
});
