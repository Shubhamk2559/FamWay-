import { useEffect, useRef } from "react";
import { Image, Animated, Easing, StyleSheet, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { auth } from "../theme/authTheme";

const RATIO = 3.3058;

export default function SplashScreen({ ready = false, onHidden }) {
  const { width } = useWindowDimensions();
  const logoW = Math.min(Math.round(width * 0.52), 240);
  const logoH = Math.round(logoW / RATIO);

  const intro = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, [intro]);

  useEffect(() => {
    if (!ready) return;
    Animated.timing(out, {
      toValue: 0, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && onHidden) onHidden();
    });
  }, [ready, out, onHidden]);

  const scale = intro.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <Animated.View
      pointerEvents={ready ? "none" : "auto"}
      style={[StyleSheet.absoluteFill, styles.container, { opacity: out }]}
    >
      <StatusBar style="light" />
      <Animated.View style={{ opacity: intro, transform: [{ scale }] }}>
        <Image
          source={require("../../assets/logo-wordmark.png")}
          style={{ width: logoW, height: logoH }}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: auth.bg, alignItems: "center", justifyContent: "center" },
});
