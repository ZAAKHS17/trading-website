import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { accountSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const account = await prisma.tradingAccount.findFirst({
    where: { id: params.id, userId: auth.userId },
  });
  if (!account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ account });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const existing = await prisma.tradingAccount.findFirst({
    where: { id: params.id, userId: auth.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = accountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const account = await prisma.tradingAccount.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ account });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const existing = await prisma.tradingAccount.findFirst({
    where: { id: params.id, userId: auth.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tradeCount = await prisma.trade.count({
    where: { tradingAccountId: params.id },
  });
  if (tradeCount > 0) {
    return NextResponse.json(
      { error: "Account has trades; delete or reassign them first" },
      { status: 409 }
    );
  }

  await prisma.tradingAccount.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
