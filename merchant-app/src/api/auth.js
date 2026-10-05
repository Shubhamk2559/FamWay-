import { request } from "./client";

export const apiLogin = (email, password) =>
  request("/api/auth/login", { method: "POST", body: { email, password } });

export const apiRegister = (form) =>
  request("/api/auth/register", { method: "POST", body: form });

export const apiMe = async () => (await request("/api/auth/me")).data;
