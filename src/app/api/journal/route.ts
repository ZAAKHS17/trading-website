import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { journalSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setUTCDate(end.getUTCDate() + 1);
    const entry = await prisma.dailyJournal.findFirst({
      where: {
        userId: auth.userId,
        date: { gte: start, lt: end },
      },
    });
    return NextResponse.json({ entry });
  }

  const entries = await prisma.dailyJournal.findMany({
    where: { userId: auth.userId },
    orderBy: { date: "desc" },
    take: 30,
  });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const auth = await requireUserId();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = journalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const date = new Date(parsed.data.date);
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const existing = await prisma.dailyJournal.findFirst({
    where: {
      userId: auth.userId,
      date: { gte: start, lt: end },
    },
  });

  const data = {
    notes: parsed.data.notes ?? null,
    mistakes: parsed.data.mistakes ?? null,
    lessons: parsed.data.lessons ?? null,
    disciplineScore: parsed.data.disciplineScore ?? null,
    emotion: parsed.data.emotion ?? null,
    date: start,
  };

  const entry = existing
    ? await prisma.dailyJournal.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.dailyJournal.create({
        data: { ...data, userId: auth.userId },
      });

  return NextResponse.json({ entry }, { status: existing ? 200 : 201 });
}
