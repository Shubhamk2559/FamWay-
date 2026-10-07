import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { auth } from "../theme/authTheme";

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.Image
        source={require("../../assets/logo-wordmark.png")}
        style={[styles.logo, { opacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: auth.bg, alignItems: "center", justifyContent: "center" },
  logo: { width: 200, aspectRatio: 3.3058 },
});
