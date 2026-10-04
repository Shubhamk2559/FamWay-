import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import { colors } from "../theme/colors";

export default function SplashScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => navigation.replace("Login"), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={[colors.navy, colors.navy2]} style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: "center" }}>
        <Logo size={72} light />
        <Text style={styles.tag}>Merchant App</Text>
      </Animated.View>
      <Text style={styles.footer}>Simple, trusted payment collection</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  tag: { marginTop: 14, color: "#7dd3fc", fontSize: 14, fontWeight: "600", letterSpacing: 2, textTransform: "uppercase" },
  footer: { position: "absolute", bottom: 48, color: "#b6c2e0", fontSize: 13 },
});
