import React from 'react';

export default function DashboardPage() {
  return (
    <div className="container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">Overview of your trading performance</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-slate-400">Total Trades</div>
          <div className="text-xl font-bold">123</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-slate-400">Win Rate</div>
          <div className="text-xl font-bold">57%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-slate-400">P&L</div>
          <div className="text-xl font-bold">$4,320</div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
        <div className="text-sm text-gray-500 dark:text-slate-400 mb-2">A placeholder table/list for recent trades or notes.</div>
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
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <td className="py-2">2026-01-01</td>
                <td className="py-2">AAPL</td>
                <td className="py-2">Win</td>
                <td className="py-2">$120</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <td className="py-2">2026-01-02</td>
                <td className="py-2">TSLA</td>
                <td className="py-2">Loss</td>
                <td className="py-2">-$80</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
