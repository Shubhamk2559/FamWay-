import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dark } from "../theme/colors";

export default function ScreenHeader({ title, subtitle, actionIcon, onAction }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {actionIcon && (
        <Pressable onPress={onAction} style={styles.action} hitSlop={8}>
          <Ionicons name={actionIcon} size={22} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", color: dark.text, letterSpacing: -0.4 },
  sub: { fontSize: 14, color: dark.sub, marginTop: 2 },
  action: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: dark.accent,
    alignItems: "center", justifyContent: "center",
  },
});
