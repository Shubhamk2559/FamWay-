import { request } from "./client";
import { MERCHANT_ID } from "../config";

// Converts a backend link into the shape the UI already uses.
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
  const json = await request(`/api/payment-links/${MERCHANT_ID}?limit=100`);
  return json.data.map(toLink);
}

export async function createPaymentLink({ amount, description, customerName }) {
  const json = await request("/api/payment-links", {
    method: "POST",
    body: { merchantId: MERCHANT_ID, amount, description, customerName },
  });
  return toLink(json.data);
}
