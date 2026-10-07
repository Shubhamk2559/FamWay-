import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CreateLinkScreen from "../screens/CreateLinkScreen";
import PaymentSettingsScreen from "../screens/PaymentSettingsScreen";
import MainTabs from "./MainTabs";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const dark = { contentStyle: { backgroundColor: "#000000" } };

export default function AppNavigator() {
  const { token, booting } = useAuth();
  const [minDone, setMinDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (booting || !minDone) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        {token ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ animation: "fade", gestureEnabled: false }} />
            <Stack.Screen name="CreateLink" component={CreateLinkScreen} />
            <Stack.Screen name="PaymentSettings" component={PaymentSettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={dark} />
            <Stack.Screen name="Register" component={RegisterScreen} options={dark} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
