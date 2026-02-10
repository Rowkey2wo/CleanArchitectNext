"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (mode === "register") {
        const registerRes = await fetch("/api/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const registerData = (await registerRes.json()) as { error?: string };
        if (!registerRes.ok) {
          throw new Error(registerData.error ?? "Registration failed");
        }
      }

  
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = (await loginRes.json()) as { error?: string };
      if (!loginRes.ok) {
        throw new Error(loginData.error ?? "Login failed");
      }

      setMessage("Success! Redirecting to dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-900">Secure Portal</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Login to access your security dashboard and test protected API routes.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "login" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "register" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <input
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-zinc-900 focus:ring"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700">
            Password
            <input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-zinc-900 focus:ring"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            type="button"
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "login" ? "Login securely" : "Register + Login"}
          </button>

          <p className={`text-sm ${isError ? "text-red-600" : "text-emerald-600"}`}>{message}</p>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700">
            <p className="font-semibold">Security Requirements</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Password must be 12+ chars with upper/lowercase, number, and symbol.</li>
              <li>State-changing API calls enforce same-origin and JSON content type.</li>
              <li>Session uses HTTP-only signed cookie with strict SameSite policy.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}