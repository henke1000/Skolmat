"use client";

import { useEffect, useState } from "react";
import type { MealWithVotes } from "@/lib/types";

type TopplistaLiveProps = {
  initialMeals: MealWithVotes[];
};

export function TopplistaLive({ initialMeals }: TopplistaLiveProps) {
  const [meals, setMeals] = useState(initialMeals);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  async function refreshTopplista() {
    const response = await fetch("/api/topplista", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const body = (await response.json()) as { meals?: MealWithVotes[] };
    setMeals(body.meals ?? []);
    setUpdatedAt(new Date());
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      void refreshTopplista();
    }, 3000);

    const onFocus = () => void refreshTopplista();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-slate-600">
        <span>Uppdateras automatiskt</span>
        <span>{updatedAt ? `Senast ${updatedAt.toLocaleTimeString("sv-SE")}` : "Live"}</span>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-soft backdrop-blur">
        {meals.length === 0 ? (
          <p className="p-8 text-center text-lg font-bold text-slate-700">Inga maträtter att visa än.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {meals.map((meal, index) => (
              <article
                className="grid grid-cols-[auto_1fr] gap-4 p-4 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:items-center sm:p-5"
                key={meal.id}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-900">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">{meal.name}</h2>
                  <p className="text-sm font-bold text-slate-500">{meal.week}</p>
                </div>
                <Stat label="Likes" value={`❤️ ${meal.likes}`} />
                <Stat label="Dislikes" value={`👎 ${meal.dislikes}`} />
                <div className="col-span-2 sm:col-span-1 sm:min-w-36">
                  <div className="mb-1 flex items-center justify-between text-sm font-black text-slate-700">
                    <span>Positiva</span>
                    <span>{meal.positivePercent}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${meal.positivePercent}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left sm:text-center">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}
