import { useState } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import {
  AuthScreen, Field, PrimaryButton, Divider, SocialButtons, TermsRow, ErrorText, comingSoon,
} from "../components/auth/AuthKit";
import { auth } from "../theme/authTheme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1); // 1 = email + terms, 2 = business details
  const [email, setEmail] = useState("");
  const [refOpen, setRefOpen] = useState(false);
  const [referral, setReferral] = useState(""); // visual only, not sent to backend yet
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ businessName: "", name: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const goLogin = () => navigation.navigate("Login");
  const canNext = EMAIL_RE.test(email.trim()) && agree;

  const validate = () => {
    if (!form.businessName.trim() || !form.name.trim()) return "Business name and your name are required.";
    if (form.phone && !/^\d{10}$/.test(form.phone)) return "Mobile number must be 10 digits.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return "";
  };

  const submit = async () => {
    if (loading) return;
    const problem = validate();
    if (problem) return setError(problem);
    setError("");
    setLoading(true);
    try {
      await register({
        businessName: form.businessName.trim(),
        name: form.name.trim(),
        email: email.trim(),
        phone: form.phone,
        password: form.password,
      });
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <AuthScreen
        back
        title="Your business"
        subtitle={email.trim()}
        onClose={() => { setStep(1); setError(""); }}
        footerText="Already have an account?"
        footerLink="Log in"
        onFooterPress={goLogin}
      >
        <Field style={{ marginTop: 30 }} label="Business name" value={form.businessName} onChangeText={set("businessName")} autoCapitalize="words" editable={!loading} />
        <Field style={{ marginTop: 18 }} label="Your name" value={form.name} onChangeText={set("name")} autoCapitalize="words" editable={!loading} />
        <Field style={{ marginTop: 18 }} label="Mobile number (optional)" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" maxLength={10} editable={!loading} />
        <Field style={{ marginTop: 18 }} label="Password" value={form.password} onChangeText={set("password")} secureTextEntry editable={!loading} />
        <Field style={{ marginTop: 18 }} label="Confirm password" value={form.confirm} onChangeText={set("confirm")} secureTextEntry editable={!loading} onSubmitEditing={submit} />
        <ErrorText>{error}</ErrorText>
        <PrimaryButton style={{ marginTop: 28 }} title="Create account" loading={loading} onPress={submit} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Sign up"
      onClose={() => navigation.goBack()}
      footerText="Already have an account?"
      footerLink="Log in"
      onFooterPress={goLogin}
    >
      <Field
        style={{ marginTop: 34 }}
        label="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Pressable style={styles.ref} onPress={() => setRefOpen((o) => !o)}>
        <Text style={styles.refText}>Referral code(Optional)</Text>
        <Ionicons name={refOpen ? "caret-up" : "caret-down"} size={14} color="#E6E6E8" />
      </Pressable>
      {refOpen ? (
        <Field style={{ marginTop: 10 }} value={referral} onChangeText={setReferral} autoCapitalize="characters" />
      ) : null}

      <TermsRow style={{ marginTop: refOpen ? 24 : 44 }} checked={agree} onToggle={() => setAgree((a) => !a)} />

      <PrimaryButton
        style={{ marginTop: 18 }}
        title="Next"
        disabled={!canNext}
        onPress={() => setStep(2)}
      />
      <Divider />
      <SocialButtons onPress={comingSoon} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  ref: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 15 },
  refText: { color: auth.text, fontSize: 14, fontWeight: "500" },
});
