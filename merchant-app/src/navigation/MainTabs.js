import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/HomeScreen";
import PaymentLinksScreen from "../screens/PaymentLinksScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { dark } from "../theme/colors";

const Tab = createBottomTabNavigator();

const icons = {
  Home: ["home", "home-outline"],
  "Payment Links": ["link", "link-outline"],
  Orders: ["receipt", "receipt-outline"],
  Profile: ["person", "person-outline"],
};

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: dark.accentText,
          tabBarInactiveTintColor: "#6F82A8",
          tabBarLabelStyle: { fontSize: 11.5, fontWeight: "700" },
          tabBarStyle: {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 6,
            paddingTop: 8,
            backgroundColor: dark.tabBar,
            borderTopColor: dark.line,
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={icons[route.name][focused ? 0 : 1]}
              size={22}
              color={color}
            />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Payment Links" component={PaymentLinksScreen} />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </>
  );
}
