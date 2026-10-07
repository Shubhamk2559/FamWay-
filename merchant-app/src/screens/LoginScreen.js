import { useState } from "react";
import { Keyboard, Pressable, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import {
  AuthScreen, Segmented, Field, PhoneField, PrimaryButton, Divider, SocialButtons,
  ErrorText, COUNTRIES, comingSoon,
} from "../components/auth/AuthKit";
import { auth } from "../theme/authTheme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [tab, setTab] = useState("email");
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canNext = tab === "email" ? EMAIL_RE.test(email.trim()) : phone.length >= 6;
  const goSignup = () => navigation.navigate("Register");

  const next = () => {
    if (tab === "phone") return comingSoon("Phone login");
    setError("");
    setStep("password");
  };

  const submit = async () => {
    if (loading || !password) return;
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (step === "password") {
    return (
      <AuthScreen
        back
        plain
        title="Enter your password"
        subtitle={
          <Text style={styles.sub}>
            Log in as <Text style={styles.subEm}>{email.trim()}</Text>
          </Text>
        }
        onClose={() => { setStep("email"); setPassword(""); setError(""); }}
      >
        <Field
          variant="black"
          style={{ marginTop: 36 }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          autoFocus
          editable={!loading}
          onSubmitEditing={submit}
          right={
            <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
              <Feather name={showPw ? "eye" : "eye-off"} size={22} color="#9A9AA1" />
            </Pressable>
          }
        />
        <ErrorText>{error}</ErrorText>
        <PrimaryButton style={{ marginTop: 28 }} title="Log in" disabled={!password} loading={loading} onPress={submit} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      showHelp
      closeInset={5}
      title="Log in"
      onClose={Keyboard.dismiss}
      footerText="Don't have an account?"
      footerLink="Sign up"
      onFooterPress={goSignup}
    >
      <Segmented
        options={[{ label: "Email", value: "email" }, { label: "Phone", value: "phone" }]}
        value={tab}
        onChange={setTab}
      />

      {tab === "email" ? (
        <Field
          style={{ marginTop: 28 }}
          label="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onSubmitEditing={() => canNext && next()}
        />
      ) : (
        <PhoneField
          style={{ marginTop: 28 }}
          label="Phone"
          country={country}
          onCountry={setCountry}
          value={phone}
          onChangeText={setPhone}
        />
      )}

      <PrimaryButton style={{ marginTop: 36 }} title="Next" disabled={!canNext} onPress={next} />
      <Divider />
      <SocialButtons onPress={comingSoon} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  sub: { color: auth.muted, fontSize: 14, marginTop: 8 },
  subEm: { color: auth.text },
});
