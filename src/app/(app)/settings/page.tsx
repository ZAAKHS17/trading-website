"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data } = useSession();

  return (
    <div className="container space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Profile and account shortcuts
        </p>
      </header>
      <div className="card space-y-2 text-sm max-w-lg">
        <div>
          <span className="text-gray-500">Signed in as </span>
          <strong>{data?.user?.email}</strong>
        </div>
        <div>
          <span className="text-gray-500">Name: </span>
          {data?.user?.name || "—"}
        </div>
        <p className="pt-2">
          Manage{" "}
          <Link href="/accounts" className="underline">
            trading accounts
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
