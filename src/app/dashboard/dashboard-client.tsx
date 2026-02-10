"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DashboardClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("120");
  const [reference, setReference] = useState("INV-2026-0001");
  const [method, setMethod] = useState<"GCASH" | "BANK">("GCASH");
  const [output, setOutput] = useState("No API calls yet.");

  async function callMe() {
    const response = await fetch("/api/auth/me");
    const json = await response.json();
    setOutput(JSON.stringify(json, null, 2));
  }

  async function createPayment() {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), method, reference }),
    });

    const json = await response.json();
    setOutput(JSON.stringify(json, null, 2));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Protected API Console</h2>
      <p className="mt-1 text-sm text-zinc-600">User: {userEmail}</p>

      <div className="mt-4 space-y-3">
        <label className="block text-sm text-zinc-700">
          Amount
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <label className="block text-sm text-zinc-700">
          Method
          <select
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={method}
            onChange={(event) => setMethod(event.target.value as "GCASH" | "BANK")}
          >
            <option value="GCASH">GCASH</option>
            <option value="BANK">BANK</option>
          </select>
        </label>

        <label className="block text-sm text-zinc-700">
          Reference
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white" onClick={createPayment}>
            POST /api/payments
          </button>
          <button className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white" onClick={callMe}>
            GET /api/auth/me
          </button>
          <button className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white" onClick={logout}>
            Logout
          </button>
        </div>

        <pre className="max-h-72 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-emerald-300">{output}</pre>
      </div>
    </article>
  );
}