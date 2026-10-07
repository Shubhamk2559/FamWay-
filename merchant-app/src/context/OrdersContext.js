import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../api/orders";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      setOrders(await fetchOrders());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) refresh();
    else {
      setOrders([]);
      setError("");
      setLoading(false);
    }
  }, [token, refresh]);

  useEffect(() => {
    if (!token) return undefined;
    const id = setInterval(() => refresh({ silent: true }), 20000);
    return () => clearInterval(id);
  }, [token, refresh]);

  const stats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    let totalPaise = 0, todayPaise = 0, paidCount = 0, pendingCount = 0;
    for (const o of orders) {
      if (o.status === "paid") {
        totalPaise += o.paise;
        paidCount += 1;
        if (o.paidAt && new Date(o.paidAt) >= start) todayPaise += o.paise;
      } else if (o.status === "pending" || o.status === "created") {
        pendingCount += 1;
      }
    }
    return { totalPaise, todayPaise, paidCount, pendingCount };
  }, [orders]);

  const value = useMemo(
    () => ({ orders, stats, loading, error, refresh }),
    [orders, stats, loading, error, refresh]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}
