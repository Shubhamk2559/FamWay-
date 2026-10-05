import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import { apiLogin, apiRegister, apiMe } from "../api/auth";

const KEY = "famway_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [booting, setBooting] = useState(true);

  const clear = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    setMerchant(null);

    try {
      await SecureStore.deleteItemAsync(KEY);
    } catch (_e) {}
  }, []);

  const save = useCallback(async (t, m) => {
    setAuthToken(t);

    try {
      await SecureStore.setItemAsync(KEY, t);
    } catch (_e) {}

    setMerchant(m);
    setToken(t);
  }, []);

  const updateMerchant = useCallback((patch) => {
    setMerchant((m) => (m ? { ...m, ...patch } : m));
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clear);

    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(KEY);

        if (saved) {
          setAuthToken(saved);

          try {
            const me = await apiMe();
            setMerchant(me);
            setToken(saved);
          } catch (e) {
            if (e.status === 401) {
              await clear();
            } else {
              setToken(saved);
            }
          }
        }
      } catch (_e) {
      } finally {
        setBooting(false);
      }
    })();
  }, [clear]);

  const login = useCallback(
    async (email, password) => {
      const json = await apiLogin(email, password);
      await save(json.token, json.data);
    },
    [save]
  );

  const register = useCallback(
    async (form) => {
      const json = await apiRegister(form);
      await save(json.token, json.data);
    },
    [save]
  );

  const value = useMemo(
    () => ({
      token,
      merchant,
      booting,
      login,
      register,
      logout: clear,
      updateMerchant,
    }),
    [
      token,
      merchant,
      booting,
      login,
      register,
      clear,
      updateMerchant,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
