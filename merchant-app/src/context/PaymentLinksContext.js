import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchPaymentLinks, createPaymentLink } from "../api/paymentLinks";

const PaymentLinksContext = createContext(null);

export function PaymentLinksProvider({ children }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      setLinks(await fetchPaymentLinks());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Throws on failure so the calling screen can show the error.
  const createLink = useCallback(
    async (input) => {
      const link = await createPaymentLink(input);
      setLinks((prev) => [link, ...prev]);
      refresh({ silent: true });
      return link;
    },
    [refresh]
  );

  const value = useMemo(
    () => ({ links, loading, error, refresh, createLink }),
    [links, loading, error, refresh, createLink]
  );

  return (
    <PaymentLinksContext.Provider value={value}>
      {children}
    </PaymentLinksContext.Provider>
  );
}

export function usePaymentLinks() {
  const ctx = useContext(PaymentLinksContext);
  if (!ctx) {
    throw new Error("usePaymentLinks must be used inside PaymentLinksProvider");
  }
  return ctx;
}
