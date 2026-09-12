import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tagSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const tags = await prisma.tag.findMany({
    where: { userId: auth.userId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ tags });
}

export async function POST(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const tag = await prisma.tag.create({
    data: { ...parsed.data, userId: auth.userId },
  });
  return NextResponse.json({ tag }, { status: 201 });
}
