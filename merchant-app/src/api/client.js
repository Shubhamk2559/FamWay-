import { API_BASE_URL } from "../config";

const TIMEOUT_MS = 20000;

export async function request(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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
      throw new Error((json && json.message) || `Request failed (${res.status})`);
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
