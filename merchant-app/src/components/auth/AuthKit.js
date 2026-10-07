import { useState } from "react";
import {
  View, Text, TextInput, Pressable, Image, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert, Modal, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { auth } from "../../theme/authTheme";

export const COUNTRIES = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
];

export const comingSoon = (what) =>
  Alert.alert("Coming soon", `${what} is not available yet. Please use your email.`);

/* ---------- Screen shell: top bar, logo, title, footer ---------- */
export function AuthScreen({
  onClose, back = false, closeInset = 0, showHelp = false,
  title, subtitle, footerText, footerLink, onFooterPress, children,
}) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.top}>
            <Pressable onPress={onClose} hitSlop={16} style={{ marginLeft: closeInset }}>
              <Feather name={back ? "arrow-left" : "x"} size={26} color="#E6E6E8" />
            </Pressable>
            {showHelp ? (
              <Pressable
                onPress={() => Alert.alert("Help", "Support chat is coming soon.")}
                hitSlop={16}
              >
                <Feather name="help-circle" size={26} color="#FFFFFF" />
              </Pressable>
            ) : (
              <View />
            )}
          </View>

          <Image source={require("../../../assets/logo-icon.png")} style={s.logo} resizeMode="contain" />
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}

          <View>{children}</View>

          <View style={s.footer}>
            <Text style={s.footerText}>{footerText} </Text>
            <Pressable onPress={onFooterPress} hitSlop={10}>
              <Text style={s.footerLink}>{footerLink}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- Email | Phone switch ---------- */
export function Segmented({ options, value, onChange, style }) {
  return (
    <View style={[s.seg, style]}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[s.segItem, active && s.segActive]}
          >
            <Text style={s.segText}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Text field ---------- */
export function Field({ label, style, right, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={style}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={[s.field, focus && s.fieldFocus]}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#6C6C72"
          selectionColor={auth.brand}
          {...props}
          style={s.input}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {right}
      </View>
    </View>
  );
}

/* ---------- Phone field with country picker ---------- */
function Flag({ emoji, size = 27 }) {
  return (
    <View style={[s.flag, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ fontSize: size * 1.25, lineHeight: size * 1.5, includeFontPadding: false }}>{emoji}</Text>
    </View>
  );
}

export function PhoneField({ label, country, onCountry, value, onChangeText, style }) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <View style={style}>
      <Text style={s.label}>{label}</Text>
      <View style={s.phoneRow}>
        <Pressable style={s.codeBox} onPress={() => setOpen(true)}>
          <Flag emoji={country.flag} />
          <Text style={s.codeText}>{country.code}</Text>
          <Ionicons name="caret-down" size={14} color="#E6E6E8" />
        </Pressable>
        <View style={[s.field, { flex: 1 }, focus && s.fieldFocus]}>
          <TextInput
            value={value}
            onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, ""))}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor="#6C6C72"
            selectionColor={auth.brand}
            style={s.input}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </View>
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={s.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Select country</Text>
            {COUNTRIES.map((c) => (
              <Pressable
                key={c.code + c.name}
                style={s.sheetRow}
                onPress={() => { onCountry(c); setOpen(false); }}
              >
                <Flag emoji={c.flag} />
                <Text style={s.sheetName}>{c.name}</Text>
                <Text style={s.sheetCode}>{c.code}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- Buttons ---------- */
export function PrimaryButton({ title, onPress, disabled, loading, style }) {
  const off = disabled || loading;
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [s.btn, off && !loading ? s.btnOff : s.btnOn, pressed && !off && { opacity: 0.85 }, style]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[s.btnText, disabled && s.btnTextOff]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Divider({ style }) {
  return (
    <View style={[s.divider, style]}>
      <View style={s.dividerLine} />
      <Text style={s.dividerText}>or</Text>
      <View style={s.dividerLine} />
    </View>
  );
}

export function SocialButtons({ onPress }) {
  return (
    <View>
      <Pressable style={[s.social, { marginTop: 22 }]} onPress={() => onPress("Google sign-in")}>
        <Image source={require("../../../assets/google-g.png")} style={s.googleIcon} resizeMode="contain" />
        <Text style={s.socialText}>Continue with Google</Text>
      </Pressable>
      <Pressable style={[s.social, { marginTop: 13 }]} onPress={() => onPress("Apple sign-in")}>
        <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
        <Text style={s.socialText}>Continue with Apple</Text>
      </Pressable>
    </View>
  );
}

/* ---------- Terms checkbox ---------- */
export function TermsRow({ checked, onToggle, style }) {
  return (
    <Pressable style={[s.terms, style]} onPress={onToggle}>
      <View style={[s.box, checked && s.boxOn]}>
        {checked ? <Feather name="check" size={13} color="#fff" /> : null}
      </View>
      <Text style={s.termsText}>
        By signing up you agree to our <Text style={s.link}>Terms & Conditions (including Legal Statement)</Text>{" "}
        and <Text style={s.link}>Privacy Policy</Text>
      </Text>
    </Pressable>
  );
}

export function ErrorText({ children, style }) {
  return children ? <Text style={[s.error, style]}>{children}</Text> : null;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: auth.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 18 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 26, height: 52 },
  logo: { width: 51, height: 48, alignSelf: "center", marginTop: 48 },
  title: { color: auth.text, fontSize: 26, fontWeight: "600", textAlign: "center", marginTop: 28 },
  sub: { color: auth.muted, fontSize: 14, textAlign: "center", marginTop: 6 },

  seg: { flexDirection: "row", height: 38, padding: 2, borderRadius: 10, backgroundColor: auth.segBg, marginTop: 40 },
  segItem: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1.5, borderColor: "transparent" },
  segActive: { backgroundColor: "#000", borderColor: auth.segBorder },
  segText: { color: auth.text, fontSize: 14, fontWeight: "500" },

  label: { color: auth.text, fontSize: 14, fontWeight: "500", marginBottom: 8 },
  field: {
    flexDirection: "row", alignItems: "center", height: 48, borderRadius: 10, paddingHorizontal: 14,
    backgroundColor: auth.field, borderWidth: 1.5, borderColor: auth.fieldBorder,
  },
  fieldFocus: { borderColor: auth.fieldFocus },
  input: { flex: 1, color: auth.text, fontSize: 16, paddingVertical: 0 },

  phoneRow: { flexDirection: "row", gap: 9 },
  codeBox: {
    flexDirection: "row", alignItems: "center", gap: 10, width: 127, height: 48, borderRadius: 10,
    paddingHorizontal: 14, backgroundColor: auth.field, borderWidth: 1.5, borderColor: auth.fieldBorder,
  },
  codeText: { color: auth.text, fontSize: 16, flex: 1 },
  flag: { overflow: "hidden", backgroundColor: "#333", alignItems: "center", justifyContent: "center" },

  btn: { height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  btnOn: { backgroundColor: auth.brand },
  btnOff: { backgroundColor: auth.btnOff },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  btnTextOff: { color: auth.btnOffText },

  divider: { flexDirection: "row", alignItems: "center", marginTop: 43, gap: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: auth.line },
  dividerText: { color: auth.muted, fontSize: 16 },

  social: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 11,
    height: 48, borderRadius: 10, backgroundColor: auth.social,
  },
  googleIcon: { width: 17, height: 17 },
  socialText: { color: auth.text, fontSize: 16, fontWeight: "500" },

  terms: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  box: {
    width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: "#5A5B61",
    marginLeft: 3, marginTop: 1, alignItems: "center", justifyContent: "center",
  },
  boxOn: { backgroundColor: auth.brand, borderColor: auth.brand },
  termsText: { flex: 1, color: auth.muted, fontSize: 14, lineHeight: 21 },
  link: { textDecorationLine: "underline", color: "#A1A1A8" },

  error: { color: auth.error, fontSize: 13.5, fontWeight: "500", marginTop: 12 },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: "auto", paddingTop: 36, paddingBottom: 40 },
  footerText: { color: auth.muted, fontSize: 14 },
  footerLink: { color: auth.text, fontSize: 14, fontWeight: "600" },

  modalRoot: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { backgroundColor: "#16161A", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 32 },
  sheetTitle: { color: auth.text, fontSize: 17, fontWeight: "600", marginBottom: 8 },
  sheetRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  sheetName: { color: auth.text, fontSize: 15, flex: 1 },
  sheetCode: { color: auth.muted, fontSize: 15 },
});
