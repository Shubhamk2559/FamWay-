import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Button({ title, onPress, variant = "primary", loading = false }) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.btn,
        primary ? styles.primary : styles.outline,
        pressed && { opacity: 0.88 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? "#fff" : colors.brand} />
      ) : (
        <Text style={[styles.text, !primary && { color: colors.brand }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  primary: { backgroundColor: colors.brand },
  outline: { borderWidth: 1.5, borderColor: colors.border, backgroundColor: "#fff" },
  text: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
