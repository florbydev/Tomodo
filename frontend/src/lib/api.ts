// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, init);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res;
}
