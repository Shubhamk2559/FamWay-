import { request } from "./client";

function toOrder(o) {
  let status = o.status;
  if (status === "pending" && o.expiresAt && new Date(o.expiresAt) < new Date()) status = "expired";
  return {
    id: o._id,
    number: o.orderNumber,
    title: (o.paymentLink && o.paymentLink.title) || "Payment",
    paise: o.payAmountPaise || o.amountPaise || 0,
    status,
    createdAt: o.createdAt,
    paidAt: o.paidAt || null,
    utr: o.utr || "",
    via: o.paidVia || "",
  };
}

export async function fetchOrders() {
  const json = await request("/api/orders?limit=100");
  return json.data.map(toOrder);
}
