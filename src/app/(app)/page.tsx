"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatMoney, pnlClass } from "@/components/Format";

type Stats = {
  totalTrades: number;
  winRate: number;
  pnl: number;
};

type Recent = {
  id: string;
  date: string;
  symbol: string;
  result: string;
  profitLoss: number | null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load dashboard");
        return r.json();
      })
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recent);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container">
      <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Overview of your trading performance
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

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-slate-400">Total Trades</div>
          <div className="text-xl font-bold">{stats ? stats.totalTrades : "…"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-slate-400">Win Rate</div>
          <div className="text-xl font-bold">{stats ? `${stats.winRate}%` : "…"}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-slate-400">P&L</div>
          <div className={`text-xl font-bold ${pnlClass(stats?.pnl)}`}>
            {stats ? formatMoney(stats.pnl) : "…"}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                <th className="py-2">Date</th>
                <th className="py-2">Symbol</th>
                <th className="py-2">Result</th>
                <th className="py-2">P&L</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-sm text-gray-500">
                    No trades yet.{" "}
                    <Link href="/trades/new" className="underline">
                      Log your first trade
                    </Link>
                  </td>
                </tr>
              )}
              {recent.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-100 dark:border-slate-700"
                >
                  <td className="py-2">{formatDate(t.date)}</td>
                  <td className="py-2">
                    <Link href={`/trades/${t.id}/edit`} className="underline">
                      {t.symbol}
                    </Link>
                  </td>
                  <td className="py-2">{t.result}</td>
                  <td className={`py-2 ${pnlClass(t.profitLoss)}`}>
                    {formatMoney(t.profitLoss)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
