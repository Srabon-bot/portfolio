"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /* Same-origin login httpOnly cookie — no token storage anywhere */
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : "/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl border flex flex-col gap-6"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex flex-col gap-1 text-center">
          <Link href="/" className="text-sm font-medium text-accent-soft hover:underline mb-2 block">
            Back to Portfolio
          </Link>
          <h1 className="text-2xl font-bold text-text">Admin CMS Portal</h1>
          <p className="text-xs text-muted">
            Authenticate to manage projects, skills, profile, and inquiries.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-faint">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="srabon361@gmail.com"
              className="rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-faint">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl py-3 text-sm font-semibold text-on-accent transition-opacity disabled:opacity-60"
            style={{ background: "var(--color-accent)" }}
          >
            {loading ? "Verifying Credentials…" : "Sign In to Admin"}
          </button>
        </form>

        <p className="text-xs text-faint text-center">
          Protected by JWT authentication and rate limiting.
        </p>
      </div>
    </div>
  );
}
