"use client";

import { FormEvent, useEffect, useState } from "react";
import type { MealWithVotes } from "@/lib/types";

type AdminPanelProps = {
  adminKey: string;
};

export function AdminPanel({ adminKey }: AdminPanelProps) {
  const [meals, setMeals] = useState<MealWithVotes[]>([]);
  const [name, setName] = useState("");
  const [week, setWeek] = useState(getIsoWeek());
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const totalVotes = meals.reduce((sum, meal) => sum + meal.total, 0);

  async function loadMeals() {
    setIsLoading(true);
    const response = await fetch(`/api/admin/meals?key=${encodeURIComponent(adminKey)}`);
    const body = (await response.json().catch(() => null)) as { meals?: MealWithVotes[]; message?: string } | null;

    if (response.ok) {
      setMeals(body?.meals ?? []);
      setMessage("");
    } else {
      setMessage(body?.message ?? "Kunde inte läsa maträtter.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  async function addMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch(`/api/admin/meals?key=${encodeURIComponent(adminKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, week })
    });
    const body = (await response.json().catch(() => null)) as { message?: string } | null;

    if (response.ok) {
      setName("");
      setMessage("Maträtten är tillagd.");
      await loadMeals();
    } else {
      setMessage(body?.message ?? "Kunde inte lägga till maträtten.");
    }
  }

  async function deleteMeal(id: string) {
    const response = await fetch(`/api/admin/meals/${id}?key=${encodeURIComponent(adminKey)}`, {
      method: "DELETE"
    });
    const body = (await response.json().catch(() => null)) as { message?: string } | null;

    if (response.ok) {
      setMessage("Maträtten är borttagen.");
      await loadMeals();
    } else {
      setMessage(body?.message ?? "Kunde inte ta bort maträtten.");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <form className="rounded-[28px] bg-white p-5 shadow-soft" onSubmit={addMeal}>
        <h2 className="text-2xl font-black text-slate-950">Lägg till</h2>
        <label className="mt-5 block">
          <span className="text-sm font-black text-slate-700">Maträtt</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-teal-500"
            onChange={(event) => setName(event.target.value)}
            placeholder="Pasta med tomatsås"
            required
            value={name}
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-700">Vecka</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-teal-500"
            onChange={(event) => setWeek(event.target.value)}
            pattern="\\d{4}-W\\d{2}"
            placeholder="2026-W24"
            required
            value={week}
          />
        </label>
        <button className="mt-5 w-full rounded-2xl bg-teal-600 px-4 py-4 text-lg font-black text-white shadow-lg" type="submit">
          Lägg till maträtt
        </button>
        {message ? <p className="mt-4 text-sm font-bold text-slate-700">{message}</p> : null}
      </form>

      <section className="overflow-hidden rounded-[28px] bg-white shadow-soft">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-2xl font-black text-slate-950">Alla maträtter och röster</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">Totalt registrerade röster: {totalVotes}</p>
        </div>

        {isLoading ? (
          <p className="p-5 font-bold text-slate-600">Laddar...</p>
        ) : meals.length === 0 ? (
          <p className="p-5 font-bold text-slate-600">Inga maträtter finns ännu.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {meals.map((meal) => (
              <article className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center" key={meal.id}>
                <div>
                  <h3 className="text-lg font-black text-slate-950">{meal.name}</h3>
                  <p className="text-sm font-bold text-slate-500">
                    {meal.week} · totalt {meal.total} · ❤️ {meal.likes} · 👎 {meal.dislikes} · {meal.positivePercent}% positiva
                  </p>
                </div>
                <button
                  className="rounded-2xl bg-rose-100 px-4 py-3 font-black text-rose-700"
                  onClick={() => void deleteMeal(meal.id)}
                  type="button"
                >
                  Ta bort
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getIsoWeek() {
  const date = new Date();
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return `${target.getUTCFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
}
