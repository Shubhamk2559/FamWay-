import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import Input from "../components/Input";
import Button from "../components/Button";
import { fetchPaymentSettings, savePaymentSettings } from "../api/settings";
import { useAuth } from "../context/AuthContext";
import { colors, dark } from "../theme/colors";

export default function PaymentSettingsScreen({ navigation }) {
  const { updateMerchant } = useAuth();

  const [upiId, setUpiId] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPaymentSettings();

        setUpiId(data.upiId || "");
        setGmail(data.gmailAddress || "");
        setHasPassword(data.hasAppPassword);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    if (saving) return;

    setError("");
    setSaved(false);
    setSaving(true);

    try {
      const data = await savePaymentSettings({
        upiId: upiId.trim(),
        gmailAddress: gmail.trim(),
        appPassword: password,
      });

      setHasPassword(data.hasAppPassword);
      setPassword("");

      updateMerchant({
        upiId: data.upiId,
        gmailAddress: data.gmailAddress,
      });

      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={dark.text} />
        </Pressable>

        <Text style={styles.title}>Payment Settings</Text>

        <View style={{ width: 28 }} />
      </View>


      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >

            <View style={styles.card}>

              <Text style={styles.heading}>
                Payment account
              </Text>

              <Input
                label="UPI ID"
                placeholder="yourname@fam"
                value={upiId}
                onChangeText={setUpiId}
                editable={!saving}
              />


              <Input
                label="Gmail Address"
                placeholder="your@gmail.com"
                keyboardType="email-address"
                value={gmail}
                onChangeText={setGmail}
                editable={!saving}
              />


              <Input
                label="Gmail App Password"
                placeholder={
                  hasPassword
                    ? "Saved (leave blank to keep)"
                    : "16 character app password"
                }
                secure
                value={password}
                onChangeText={setPassword}
                editable={!saving}
              />


              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : null}


              {saved ? (
                <Text style={styles.success}>
                  Saved successfully
                </Text>
              ) : null}


              <Button
                title="Save Settings"
                onPress={save}
                loading={saving}
              />

            </View>


            <Text style={styles.note}>
              Gmail app password is stored encrypted. Normal Gmail password
              should never be used.
            </Text>


          </ScrollView>

        </KeyboardAvoidingView>
      )}

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  safe:{
    flex:1,
    backgroundColor:dark.bg,
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    padding:20,
  },

  title:{
    color:dark.text,
    fontSize:18,
    fontWeight:"800",
  },

  container:{
    padding:20,
  },

  card:{
    backgroundColor:"#fff",
    borderRadius:18,
    padding:20,
  },

  heading:{
    fontSize:17,
    fontWeight:"800",
    marginBottom:18,
    color:colors.text,
  },

  error:{
    color:colors.danger,
    marginBottom:12,
    fontWeight:"600",
  },

  success:{
    color:colors.success,
    marginBottom:12,
    fontWeight:"700",
  },

  note:{
    color:dark.sub,
    textAlign:"center",
    marginTop:20,
    fontSize:13,
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },

});
