import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { strategySchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const strategies = await prisma.strategy.findMany({
    where: { userId: auth.userId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ strategies });
}

export async function POST(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = strategySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const strategy = await prisma.strategy.create({
    data: { ...parsed.data, userId: auth.userId },
  });
  return NextResponse.json({ strategy }, { status: 201 });
}
