"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatMoney } from "@/components/Format";

type Account = {
  id: string;
  name: string;
  broker: string | null;
  startingBalance: number;
  currentBalance: number;
  accountType: string;
  currency: string | null;
};

const TYPES = ["CASH", "MARGIN", "PROPFIRM", "OTHER"];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/accounts");
    if (!r.ok) {
      setError("Failed to load accounts");
      return;
    }
    const data = await r.json();
    setAccounts(data.accounts);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const starting = Number(fd.get("startingBalance"));
    const payload = {
      name: String(fd.get("name")),
      broker: String(fd.get("broker") || "") || null,
      startingBalance: starting,
      currentBalance: Number(fd.get("currentBalance") || starting),
      accountType: String(fd.get("accountType")),
      currency: String(fd.get("currency") || "USD"),
    };
    const r = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(data.error || "Create failed");
      return;
    }
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this account?")) return;
    const r = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    const data = await r.json();
    if (!r.ok) {
      alert(data.error || "Delete failed");
      return;
    }
    load();
  }

  return (
    <div className="container space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Manage trading accounts
        </p>
      </header>

      {error && <p className="text-rose-600 text-sm">{error}</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100 dark:border-slate-700">
              <th className="py-2">Name</th>
              <th className="py-2">Broker</th>
              <th className="py-2">Type</th>
              <th className="py-2">Starting</th>
              <th className="py-2">Current</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 dark:border-slate-700">
                <td className="py-2 font-medium">{a.name}</td>
                <td className="py-2">{a.broker || "—"}</td>
                <td className="py-2">{a.accountType}</td>
                <td className="py-2">{formatMoney(a.startingBalance, a.currency || "USD")}</td>
                <td className="py-2">{formatMoney(a.currentBalance, a.currency || "USD")}</td>
                <td className="py-2">
                  <button
                    type="button"
                    className="text-rose-600"
                    onClick={() => onDelete(a.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-gray-500">
                  No accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={onCreate} className="card space-y-3 max-w-xl">
        <h2 className="font-medium">Add account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm block sm:col-span-2">
            Name
            <input
              name="name"
              required
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            Broker
            <input
              name="broker"
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            Type
            <select
              name="accountType"
              defaultValue="CASH"
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm block">
            Starting balance
            <input
              name="startingBalance"
              type="number"
              step="any"
              required
              defaultValue={10000}
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            Current balance
            <input
              name="currentBalance"
              type="number"
              step="any"
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            Currency
            <input
              name="currency"
              defaultValue="USD"
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Saving…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
