import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { accountSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const accounts = await prisma.tradingAccount.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ accounts });
}

export async function POST(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = accountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const account = await prisma.tradingAccount.create({
      data: { ...parsed.data, userId: auth.userId },
    });
    return NextResponse.json({ account }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
