import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/HomeScreen";
import PaymentLinksScreen from "../screens/PaymentLinksScreen";
import CreateScreen from "../screens/CreateScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { useKeyboardVisible } from "../components/ui/UIKit";
import { auth } from "../theme/authTheme";

const Tab = createBottomTabNavigator();

const TABS = {
  Home: { label: "Home", icon: (c) => <Ionicons name="home" size={22} color={c} /> },
  Links: { label: "Links", icon: (c) => <Ionicons name="link" size={22} color={c} /> },
  Create: {
    label: "Create",
    icon: (c) => (
      <View style={[s.sq, { backgroundColor: c }]}>
        <Feather name="plus" size={14} color="#000" />
      </View>
    ),
  },
  Orders: { label: "Orders", icon: (c) => <Ionicons name="receipt" size={22} color={c} /> },
};

const BORDER = 1.5;
const PAD = 4;

function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const kb = useKeyboardVisible();
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);
  const itemW = w ? (w - BORDER * 2 - PAD * 2) / state.routes.length : 0;

  useEffect(() => {
    if (!itemW) return;
    const to = state.index * itemW;
    if (!placed.current) {
      x.setValue(to);
      placed.current = true;
      return;
    }
    Animated.spring(x, { toValue: to, stiffness: 240, damping: 24, mass: 1, useNativeDriver: true }).start();
  }, [state.index, itemW, x]);

  if (kb) return null;

  const press = (route, focused) => {
    const e = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (!focused && !e.defaultPrevented) navigation.navigate(route.name, route.params);
  };

  return (
    <View style={[s.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={s.bar} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {itemW ? <Animated.View style={[s.pill, { width: itemW, transform: [{ translateX: x }] }]} /> : null}
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const color = focused ? auth.brand : "#FFFFFF";
          const tab = TABS[route.name];
          return (
            <Pressable key={route.key} style={s.item} onPress={() => press(route, focused)} accessibilityRole="button">
              {tab.icon(color)}
              <Text style={[s.label, { color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Links" component={PaymentLinksScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: "#000", paddingHorizontal: 9, paddingTop: 6 },
  bar: {
    flexDirection: "row", height: 60, borderRadius: 30, borderWidth: BORDER, borderColor: "#2C2C30",
    padding: PAD, backgroundColor: "#050506",
  },
  pill: { position: "absolute", left: PAD, top: PAD, bottom: PAD, borderRadius: 26, backgroundColor: "#1D1D20" },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  label: { fontSize: 12.5, fontWeight: "600" },
  sq: { width: 21, height: 21, borderRadius: 4, alignItems: "center", justifyContent: "center" },
});
