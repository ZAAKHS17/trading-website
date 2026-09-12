import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const accountSchema = z.object({
  name: z.string().min(1).max(120),
  broker: z.string().max(120).optional().nullable(),
  propFirm: z.string().max(120).optional().nullable(),
  startingBalance: z.number(),
  currentBalance: z.number(),
  accountSize: z.number().int().optional().nullable(),
  accountType: z.enum(["CASH", "MARGIN", "PROPFIRM", "OTHER"]),
  currency: z.string().max(10).optional().nullable(),
});

export const tradeSchema = z.object({
  tradingAccountId: z.string().uuid(),
  strategyId: z.string().uuid().optional().nullable(),
  date: z.string().min(1),
  time: z.string().optional().nullable(),
  symbol: z.string().min(1).max(40),
  assetType: z.enum([
    "STOCK",
    "FOREX",
    "CRYPTO",
    "FUTURES",
    "OPTION",
    "ETF",
    "OTHER",
  ]),
  direction: z.enum(["LONG", "SHORT"]),
  entryPrice: z.number(),
  stopLoss: z.number().optional().nullable(),
  takeProfit: z.number().optional().nullable(),
  exitPrice: z.number().optional().nullable(),
  positionSize: z.number().optional().nullable(),
  riskAmount: z.number().optional().nullable(),
  profitLoss: z.number().optional().nullable(),
  fees: z.number().optional().nullable(),
  riskReward: z.number().optional().nullable(),
  session: z.enum([
    "ASIA",
    "LONDON",
    "NEW_YORK",
    "PRE_MARKET",
    "POST_MARKET",
    "OTHER",
  ]),
  result: z.enum(["WIN", "LOSS", "BREAK_EVEN"]),
  notes: z.string().optional().nullable(),
  mistakes: z.string().optional().nullable(),
  lessons: z.string().optional().nullable(),
  emotionBefore: z.string().optional().nullable(),
  emotionAfter: z.string().optional().nullable(),
  confidenceLevel: z.number().int().min(1).max(10).optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const journalSchema = z.object({
  date: z.string().min(1),
  notes: z.string().optional().nullable(),
  mistakes: z.string().optional().nullable(),
  lessons: z.string().optional().nullable(),
  disciplineScore: z.number().int().min(1).max(10).optional().nullable(),
  emotion: z.string().optional().nullable(),
});

export const strategySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().optional().nullable(),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(60),
});
