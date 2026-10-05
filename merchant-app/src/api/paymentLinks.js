import { request } from "./client";

function toLink(l) {
  const rupees = l.amount ?? (l.amountPaise || 0) / 100;
  const url = l.url || "";
  return {
    id: l._id,
    title: l.title,
    amount: `₹${Number(rupees).toLocaleString("en-IN")}`,
    slug: url.replace(/^https?:\/\//, ""),
    url,
    status: l.status,
    payments: l.paymentsCount || 0,
  };
}

export async function fetchPaymentLinks() {
  const json = await request("/api/payment-links?limit=100");
  return json.data.map(toLink);
}

export async function createPaymentLink({ amount, description, customerName }) {
  const json = await request("/api/payment-links", {
    method: "POST",
    body: { amount, description, customerName },
  });
  return toLink(json.data);
}
