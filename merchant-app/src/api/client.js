import { API_BASE_URL } from "../config";

const TIMEOUT_MS = 20000;

let authToken = null;
let onUnauthorized = null;

export const setAuthToken = (t) => {
  authToken = t;
};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export async function request(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    let json = null;
    try {
      json = await res.json();
    } catch (_e) {
      json = null;
    }

    if (!res.ok || !json || json.success === false) {
      if (res.status === 401 && authToken && onUnauthorized) onUnauthorized();
      const err = new Error((json && json.message) || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return json;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    if (err instanceof TypeError) {
      throw new Error("Cannot reach the server. Check your internet.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
