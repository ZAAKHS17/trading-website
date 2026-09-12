import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tradeSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const trade = await prisma.trade.findFirst({
    where: { id: params.id, userId: auth.userId },
    include: {
      tradingAccount: { select: { id: true, name: true } },
      strategy: { select: { id: true, name: true } },
      tradeTags: { include: { tag: true } },
    },
  });
  if (!trade) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ trade });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const existing = await prisma.trade.findFirst({
    where: { id: params.id, userId: auth.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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

  await prisma.tradeTag.deleteMany({ where: { tradeId: params.id } });

  const trade = await prisma.trade.update({
    where: { id: params.id },
    data: {
      ...rest,
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

  return NextResponse.json({ trade });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const existing = await prisma.trade.findFirst({
    where: { id: params.id, userId: auth.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.tradeTag.deleteMany({ where: { tradeId: params.id } });
  await prisma.trade.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
