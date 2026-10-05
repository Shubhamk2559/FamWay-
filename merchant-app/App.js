import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { PaymentLinksProvider } from "./src/context/PaymentLinksContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaymentLinksProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </PaymentLinksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
