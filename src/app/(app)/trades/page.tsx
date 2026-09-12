"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatMoney, pnlClass } from "@/components/Format";

type Trade = {
  id: string;
  date: string;
  symbol: string;
  direction: string;
  result: string;
  profitLoss: number | null;
  tradingAccount?: { name: string };
  strategy?: { name: string } | null;
};

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/trades");
    if (!r.ok) {
      setError("Failed to load trades");
      return;
    }
    const data = await r.json();
    setTrades(data.trades);
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this trade?")) return;
    const r = await fetch(`/api/trades/${id}`, { method: "DELETE" });
    if (!r.ok) {
      alert("Delete failed");
      return;
    }
    load();
  }

  return (
    <div className="container">
      <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Trades</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Your trade log
          </p>
        </div>
        <Link
          href="/trades/new"
          className="rounded bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 px-3 py-2 text-sm font-medium"
        >
          New trade
        </Link>
      </header>

      {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100 dark:border-slate-700">
              <th className="py-2">Date</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Dir</th>
              <th className="py-2">Result</th>
              <th className="py-2">P&L</th>
              <th className="py-2">Account</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 dark:border-slate-700">
                <td className="py-2">{formatDate(t.date)}</td>
                <td className="py-2 font-medium">{t.symbol}</td>
                <td className="py-2">{t.direction}</td>
                <td className="py-2">{t.result}</td>
                <td className={`py-2 ${pnlClass(t.profitLoss)}`}>
                  {formatMoney(t.profitLoss)}
                </td>
                <td className="py-2">{t.tradingAccount?.name}</td>
                <td className="py-2 space-x-2 whitespace-nowrap">
                  <Link href={`/trades/${t.id}/edit`} className="underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(t.id)}
                    className="text-rose-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-gray-500">
                  No trades yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
