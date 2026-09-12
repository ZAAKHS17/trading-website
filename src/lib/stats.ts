export type TradeLike = {
  result: "WIN" | "LOSS" | "BREAK_EVEN";
  profitLoss: number | null;
};

export function computeDashboardStats(trades: TradeLike[]) {
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === "WIN").length;
  const winRate = totalTrades === 0 ? 0 : (wins / totalTrades) * 100;
  const pnl = trades.reduce((sum, t) => sum + (t.profitLoss ?? 0), 0);

  return {
    totalTrades,
    wins,
    losses: trades.filter((t) => t.result === "LOSS").length,
    breakEven: trades.filter((t) => t.result === "BREAK_EVEN").length,
    winRate: Math.round(winRate * 10) / 10,
    pnl: Math.round(pnl * 100) / 100,
  };
}
