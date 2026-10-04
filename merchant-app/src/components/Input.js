import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Input({ label, secure = false, ...props }) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, focused && styles.focused]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9aa3b5"
          secureTextEntry={hidden}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secure && (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Text style={styles.toggle}>{hidden ? "Show" : "Hide"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bgAlt,
  },
  focused: { borderColor: colors.brand, backgroundColor: "#fff" },
  input: { flex: 1, fontSize: 16, color: colors.text },
  toggle: { color: colors.brand, fontWeight: "600", fontSize: 13 },
});
