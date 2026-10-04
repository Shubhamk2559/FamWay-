import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { links as initialLinks } from "../data/mockData";

const PaymentLinksContext = createContext(null);

export function PaymentLinksProvider({ children }) {
  const [links, setLinks] = useState(initialLinks);

  const addLink = useCallback((newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  }, []);

  const value = useMemo(() => ({ links, addLink }), [links, addLink]);

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
