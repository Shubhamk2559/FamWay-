import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CreateLinkScreen from "../screens/CreateLinkScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: "fade" }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ animation: "fade", gestureEnabled: false }}
        />
        <Stack.Screen name="CreateLink" component={CreateLinkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
