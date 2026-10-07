import { useState } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import {
  AuthScreen, Field, PrimaryButton, Divider, SocialButtons, TermsRow, ErrorText,
  PasswordRules, passwordOk, comingSoon,
} from "../components/auth/AuthKit";
import { auth } from "../theme/authTheme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [refOpen, setRefOpen] = useState(false);
  const [referral, setReferral] = useState("");
  const [agree, setAgree] = useState(false);
  const [biz, setBiz] = useState({ businessName: "", name: "", phone: "" });
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setB = (k) => (v) => setBiz((b) => ({ ...b, [k]: v }));

  const goLogin = () => navigation.navigate("Login");
  const emailOk = EMAIL_RE.test(email.trim()) && agree;
  const bizOk = biz.businessName.trim() && biz.name.trim() && (!biz.phone || /^\d{10}$/.test(biz.phone));

  const submit = async () => {
    if (loading || !passwordOk(password)) return;
    setError("");
    setLoading(true);
    try {
      await register({
        businessName: biz.businessName.trim(),
        name: biz.name.trim(),
        email: email.trim(),
        phone: biz.phone,
        password,
      });
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <AuthScreen back plain title="Enter your password" onClose={() => { setStep(2); setError(""); }}>
        <Field
          variant="black"
          style={{ marginTop: 36 }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          autoFocus
          editable={!loading}
          maxLength={32}
          right={
            <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
              <Feather name={showPw ? "eye" : "eye-off"} size={22} color="#9A9AA1" />
            </Pressable>
          }
        />
        <PasswordRules value={password} />
        <ErrorText>{error}</ErrorText>
        <PrimaryButton
          style={{ marginTop: 28 }}
          title="Sign up"
          disabled={!passwordOk(password)}
          loading={loading}
          onPress={submit}
        />
      </AuthScreen>
    );
  }

  if (step === 2) {
    return (
      <AuthScreen back plain title="About your business" subtitle="This is shown to your customers on the pay page." onClose={() => setStep(1)}>
        <Field style={{ marginTop: 30 }} label="Business name" value={biz.businessName} onChangeText={setB("businessName")} autoCapitalize="words" />
        <Field style={{ marginTop: 18 }} label="Your name" value={biz.name} onChangeText={setB("name")} autoCapitalize="words" />
        <Field style={{ marginTop: 18 }} label="Mobile number (optional)" value={biz.phone} onChangeText={setB("phone")} keyboardType="phone-pad" maxLength={10} />
        <PrimaryButton style={{ marginTop: 30 }} title="Next" disabled={!bizOk} onPress={() => setStep(3)} />
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
      <Field style={{ marginTop: 34 }} label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Pressable style={styles.ref} onPress={() => setRefOpen((o) => !o)}>
        <Text style={styles.refText}>Referral code(Optional)</Text>
        <Ionicons name={refOpen ? "caret-up" : "caret-down"} size={14} color="#E6E6E8" />
      </Pressable>
      {refOpen ? (
        <Field style={{ marginTop: 10 }} value={referral} onChangeText={setReferral} autoCapitalize="characters" />
      ) : null}

      <TermsRow style={{ marginTop: refOpen ? 24 : 44 }} checked={agree} onToggle={() => setAgree((a) => !a)} />
      <PrimaryButton style={{ marginTop: 18 }} title="Next" disabled={!emailOk} onPress={() => setStep(2)} />
      <Divider />
      <SocialButtons onPress={comingSoon} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  ref: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 15 },
  refText: { color: auth.text, fontSize: 14, fontWeight: "500" },
});
