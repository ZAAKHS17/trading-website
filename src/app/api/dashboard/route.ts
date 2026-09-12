import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { computeDashboardStats } from "@/lib/stats";

export async function GET() {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const trades = await prisma.trade.findMany({
    where: { userId: auth.userId },
    select: { result: true, profitLoss: true, date: true, symbol: true, id: true },
    orderBy: { date: "desc" },
  });

  const stats = computeDashboardStats(trades);
  const recent = trades.slice(0, 10).map((t) => ({
    id: t.id,
    date: t.date,
    symbol: t.symbol,
    result: t.result,
    profitLoss: t.profitLoss,
  }));

  return NextResponse.json({ stats, recent });
}
