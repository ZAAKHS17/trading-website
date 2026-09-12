"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatDate } from "@/components/Format";

type Entry = {
  id: string;
  date: string;
  notes: string | null;
  mistakes: string | null;
  lessons: string | null;
  disciplineScore: number | null;
  emotion: string | null;
};

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function load() {
    const r = await fetch("/api/journal");
    if (!r.ok) {
      setError("Failed to load journal");
      return;
    }
    const data = await r.json();
    setEntries(data.entries || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      date: String(fd.get("date")),
      notes: String(fd.get("notes") || "") || null,
      mistakes: String(fd.get("mistakes") || "") || null,
      lessons: String(fd.get("lessons") || "") || null,
      emotion: String(fd.get("emotion") || "") || null,
      disciplineScore: fd.get("disciplineScore")
        ? Number(fd.get("disciplineScore"))
        : null,
    };
    const r = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(data.error || "Save failed");
      return;
    }
    load();
  }

  return (
    <div className="container space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Daily journal</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Light daily notes, mistakes, and lessons
        </p>
      </header>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <form onSubmit={onSubmit} className="card space-y-3 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm block">
            Date
            <input
              name="date"
              type="date"
              defaultValue={today}
              required
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
          <label className="text-sm block">
            Discipline (1-10)
            <input
              name="disciplineScore"
              type="number"
              min={1}
              max={10}
              className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
            />
          </label>
        </div>
        <label className="text-sm block">
          Emotion
          <input
            name="emotion"
            className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          Notes
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          Mistakes
          <textarea
            name="mistakes"
            rows={2}
            className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          Lessons
          <textarea
            name="lessons"
            rows={2}
            className="mt-1 w-full rounded border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save entry"}
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="font-medium">Recent entries</h2>
        {entries.map((e) => (
          <article key={e.id} className="card text-sm space-y-1">
            <div className="font-medium">{formatDate(e.date)}</div>
            {e.emotion && <div>Emotion: {e.emotion}</div>}
            {e.disciplineScore != null && (
              <div>Discipline: {e.disciplineScore}/10</div>
            )}
            {e.notes && <p className="text-gray-600 dark:text-slate-300">{e.notes}</p>}
            {e.mistakes && (
              <p className="text-rose-700 dark:text-rose-300">Mistakes: {e.mistakes}</p>
            )}
            {e.lessons && (
              <p className="text-emerald-700 dark:text-emerald-300">
                Lessons: {e.lessons}
              </p>
            )}
          </article>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-gray-500">No journal entries yet.</p>
        )}
      </section>
    </div>
  );
}
