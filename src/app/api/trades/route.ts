import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tradeSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  const trades = await prisma.trade.findMany({
    where: {
      userId: auth.userId,
      ...(accountId ? { tradingAccountId: accountId } : {}),
    },
    include: {
      tradingAccount: { select: { id: true, name: true } },
      strategy: { select: { id: true, name: true } },
      tradeTags: { include: { tag: true } },
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ trades });
}

export async function POST(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = tradeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { tagIds, date, ...rest } = parsed.data;

  const account = await prisma.tradingAccount.findFirst({
    where: { id: rest.tradingAccountId, userId: auth.userId },
  });
  if (!account) {
    return NextResponse.json({ error: "Invalid account" }, { status: 400 });
  }

  if (rest.strategyId) {
    const strategy = await prisma.strategy.findFirst({
      where: { id: rest.strategyId, userId: auth.userId },
    });
    if (!strategy) {
      return NextResponse.json({ error: "Invalid strategy" }, { status: 400 });
    }
  }

  const trade = await prisma.trade.create({
    data: {
      ...rest,
      userId: auth.userId,
      date: new Date(date),
      tradeTags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: {
      tradingAccount: { select: { id: true, name: true } },
      strategy: { select: { id: true, name: true } },
      tradeTags: { include: { tag: true } },
    },
  });

  return NextResponse.json({ trade }, { status: 201 });
}
