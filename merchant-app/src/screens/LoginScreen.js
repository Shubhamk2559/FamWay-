import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import { colors } from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Logo size={44} />

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Log in to manage your payment links and orders.</Text>

          <View style={{ marginTop: 28 }}>
            <Input
              label="Email"
              placeholder="you@business.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              secure
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.forgot}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>

            <Button title="Login" onPress={() => {}} />
          </View>

          <View style={styles.bottom}>
            <Text style={styles.muted}>New to FamWay? </Text>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Create account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 32 },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginTop: 36, letterSpacing: -0.5 },
  sub: { fontSize: 15, color: colors.muted, marginTop: 6 },
  forgot: { alignSelf: "flex-end", marginBottom: 20, marginTop: -4 },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14 },
  muted: { color: colors.muted, fontSize: 14 },
  bottom: { flexDirection: "row", justifyContent: "center", marginTop: "auto", paddingTop: 32 },
});
