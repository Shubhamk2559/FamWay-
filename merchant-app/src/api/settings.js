import { request } from "./client";

export const fetchPaymentSettings = async () =>
  (await request("/api/settings/payment")).data;

export const savePaymentSettings = async (body) =>
  (
    await request("/api/settings/payment", {
      method: "PUT",
      body,
    })
  ).data;
