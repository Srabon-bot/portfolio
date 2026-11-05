"use client";

/*
 * admin-client.ts — fetch helpers for the admin console.
 * All requests are same-origin + cookie-authenticated (httpOnly JWT set
 * by /api/admin/login). No tokens in localStorage, ever.
 */

export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; data: T | null; error: string | null }> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      credentials: "same-origin",
    });
    const data = (await res.json().catch(() => null)) as T | null;
    if (!res.ok) {
      const msg =
        (data as { error?: string } | null)?.error ||
        `Request failed (${res.status})`;
      return { ok: false, data, error: msg };
    }
    return { ok: true, data, error: null };
  } catch (err: unknown) {
    return {
      ok: false,
      data: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export type Feedback = { type: "success" | "error"; text: string } | null;
