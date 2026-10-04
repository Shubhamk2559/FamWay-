import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function Button({ title, onPress, variant = "primary", loading = false }) {
  const content = loading ? (
    <ActivityIndicator color={variant === "primary" ? "#fff" : colors.brand} />
  ) : (
    <Text style={[styles.text, variant !== "primary" && { color: colors.brand }]}>{title}</Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[colors.brand, "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          {content}
        </LinearGradient>
      ) : (
        <Pressable style={[styles.btn, styles.outline]} onPress={onPress}>
          {content}
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  outline: { borderWidth: 1.5, borderColor: colors.border, backgroundColor: "#fff" },
  text: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
