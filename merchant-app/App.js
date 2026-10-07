import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { PaymentLinksProvider } from "./src/context/PaymentLinksContext";
import { OrdersProvider } from "./src/context/OrdersContext";

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: "#000" }}>
      <AuthProvider>
        <PaymentLinksProvider>
          <OrdersProvider>
            <StatusBar style="light" />
            <AppNavigator />
          </OrdersProvider>
        </PaymentLinksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
