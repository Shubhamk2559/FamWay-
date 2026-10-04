import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import { colors } from "../theme/colors";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    businessName: "", name: "", email: "", phone: "", password: "", confirm: "",
  });
  const set = (key) => (value) => setForm({ ...form, [key]: value });

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
            <Input label="Business name" placeholder="Aarav Stores" autoCapitalize="words" value={form.businessName} onChangeText={set("businessName")} />
            <Input label="Your name" placeholder="Full name" autoCapitalize="words" value={form.name} onChangeText={set("name")} />
            <Input label="Email" placeholder="you@business.com" keyboardType="email-address" value={form.email} onChangeText={set("email")} />
            <Input label="Mobile number" placeholder="10-digit number" keyboardType="phone-pad" maxLength={10} value={form.phone} onChangeText={set("phone")} />
            <Input label="Password" placeholder="Minimum 8 characters" secure value={form.password} onChangeText={set("password")} />
            <Input label="Confirm password" placeholder="Re-enter password" secure value={form.confirm} onChangeText={set("confirm")} />

            <Text style={styles.terms}>
              By creating an account you agree to FamWay's <Text style={styles.link}>Terms</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>

            <Button title="Create Account" onPress={() => {}} />
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
  terms: { fontSize: 12.5, color: colors.muted, lineHeight: 18, marginBottom: 20 },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14 },
  muted: { color: colors.muted, fontSize: 14 },
  bottom: { flexDirection: "row", justifyContent: "center", paddingTop: 28 },
});
