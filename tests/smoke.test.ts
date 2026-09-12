import { describe, expect, it } from "vitest";
import { computeDashboardStats } from "@/lib/stats";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  accountSchema,
  loginSchema,
  registerSchema,
  tradeSchema,
} from "@/lib/validations";

describe("auth smoke", () => {
  it("hashes and verifies passwords with bcrypt", async () => {
    const hash = await hashPassword("demo-password");
    expect(hash).not.toEqual("demo-password");
    expect(hash.startsWith("$2")).toBe(true);
    expect(await verifyPassword("demo-password", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("validates register and login payloads", () => {
    expect(
      registerSchema.safeParse({
        email: "demo@example.com",
        password: "demo-password",
        name: "Demo",
      }).success
    ).toBe(true);
    expect(
      registerSchema.safeParse({
        email: "bad",
        password: "short",
      }).success
    ).toBe(false);
    expect(
      loginSchema.safeParse({
        email: "demo@example.com",
        password: "x",
      }).success
    ).toBe(true);
  });
});

describe("trade CRUD validation smoke", () => {
  const baseTrade = {
    tradingAccountId: "11111111-1111-1111-1111-111111111111",
    date: "2023-08-01",
    symbol: "AAPL",
    assetType: "STOCK",
    direction: "LONG",
    entryPrice: 175.25,
    session: "NEW_YORK",
    result: "WIN",
    profitLoss: 275.85,
  };

  it("accepts a valid trade create payload", () => {
    const parsed = tradeSchema.safeParse(baseTrade);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid trade payloads", () => {
    expect(
      tradeSchema.safeParse({ ...baseTrade, tradingAccountId: "not-a-uuid" })
        .success
    ).toBe(false);
    expect(tradeSchema.safeParse({ ...baseTrade, symbol: "" }).success).toBe(
      false
    );
  });

  it("accepts a valid account payload", () => {
    expect(
      accountSchema.safeParse({
        name: "Demo Account",
        startingBalance: 10000,
        currentBalance: 10000,
        accountType: "CASH",
        currency: "USD",
      }).success
    ).toBe(true);
  });
});

describe("dashboard stats smoke", () => {
  it("computes total trades, win rate, and P&L", () => {
    const stats = computeDashboardStats([
      { result: "WIN", profitLoss: 275.85 },
      { result: "WIN", profitLoss: 750 },
      { result: "LOSS", profitLoss: -500 },
    ]);
    expect(stats.totalTrades).toBe(3);
    expect(stats.wins).toBe(2);
    expect(stats.losses).toBe(1);
    expect(stats.winRate).toBe(66.7);
    expect(stats.pnl).toBe(525.85);
  });

  it("handles empty trade lists", () => {
    const stats = computeDashboardStats([]);
    expect(stats).toEqual({
      totalTrades: 0,
      wins: 0,
      losses: 0,
      breakEven: 0,
      winRate: 0,
      pnl: 0,
    });
  });
});
