import React from 'react';
import Link from 'next/link';
import './globals.css';

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <div className="flex">
          <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:sticky md:top-0 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-4">
            <div className="mb-6 text-lg font-semibold">Trading Journal</div>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Dashboard</Link>
              <Link href="#" className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Trades</Link>
              <Link href="#" className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Calendar</Link>
              <Link href="#" className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Settings</Link>
            </nav>
            <div className="mt-auto text-xs text-gray-500 dark:text-slate-400">v0.1</div>
          </aside>

          <main className="flex-1 p-6">
            {/* Mobile top nav */}
            <div className="md:hidden mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold">Trading Journal</div>
              <div className="text-sm text-gray-500 dark:text-slate-400">v0.1</div>
            </div>

            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
