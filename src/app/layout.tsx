import React from "react";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Trading Journal",
  description: "Phase 1 MVP trading journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
