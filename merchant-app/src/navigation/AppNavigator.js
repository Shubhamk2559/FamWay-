import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PaymentSettingsScreen from "../screens/PaymentSettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";
import SecurityScreen from "../screens/SecurityScreen";
import AccountScreen from "../screens/AccountScreen";
import MainTabs from "./MainTabs";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: "#000000", card: "#000000", border: "#000000", primary: "#F20136" },
};
const screenOptions = {
  headerShown: false,
  animation: "slide_from_right",
  contentStyle: { backgroundColor: "#000000" },
};

export default function AppNavigator() {
  const { token, booting } = useAuth();
  const [minDone, setMinDone] = useState(false);
  const [splashGone, setSplashGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const hide = useCallback(() => setSplashGone(true), []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      {booting ? null : (
        <NavigationContainer theme={theme}>
          <Stack.Navigator screenOptions={screenOptions}>
            {token ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} options={{ animation: "fade", gestureEnabled: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="About" component={AboutScreen} />
                <Stack.Screen name="Security" component={SecurityScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
                <Stack.Screen name="PaymentSettings" component={PaymentSettingsScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
      {splashGone ? null : <SplashScreen ready={!booting && minDone} onHidden={hide} />}
    </View>
  );
}
