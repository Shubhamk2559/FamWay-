import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function Logo({ size = 56, light = false, showText = true }) {
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={[colors.brand, colors.brand2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: size, height: size, borderRadius: size * 0.3, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: size * 0.5 }}>F</Text>
      </LinearGradient>
      {showText && (
        <Text style={[styles.text, { fontSize: size * 0.55, color: light ? "#fff" : colors.navy }]}>
          FamWay
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { fontWeight: "800", letterSpacing: -0.5 },
});
