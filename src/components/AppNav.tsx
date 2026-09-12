"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/trades", label: "Trades" },
  { href: "/accounts", label: "Accounts" },
  { href: "/journal", label: "Journal" },
  { href: "/calendar", label: "Calendar" },
  { href: "/settings", label: "Settings" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded text-sm ${
        active
          ? "bg-gray-200 dark:bg-slate-700 font-medium"
          : "hover:bg-gray-100 dark:hover:bg-slate-700"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AppNav() {
  const { data } = useSession();

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:sticky md:top-0 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-4">
        <div className="mb-6 text-lg font-semibold">Trading Journal</div>
        <nav className="flex flex-col space-y-2">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <div className="text-xs text-gray-500 dark:text-slate-400 truncate">
            {data?.user?.email}
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Log out
          </button>
          <div className="text-xs text-gray-500 dark:text-slate-400">v0.1 MVP</div>
        </div>
      </aside>

      <div className="md:hidden mb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="text-lg font-semibold">Trading Journal</div>
        <div className="flex flex-wrap gap-1">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
