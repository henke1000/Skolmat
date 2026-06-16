"use client";

import { useEffect, useRef, useState } from "react";
import type { MealWithVotes } from "@/lib/types";

type TopplistaLiveProps = {
  initialMeals: MealWithVotes[];
};

export function TopplistaLive({ initialMeals }: TopplistaLiveProps) {
  const [meals, setMeals] = useState(initialMeals);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const isRefreshing = useRef(false);
  const totalVotes = meals.reduce((sum, meal) => sum + meal.total, 0);

  async function refreshTopplista() {
    if (isRefreshing.current) {
      return;
    }

    isRefreshing.current = true;

    try {
      const response = await fetch(`/api/topplista?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-store"
        }
      });

      if (!response.ok) {
        return;
      }

      const body = (await response.json()) as { meals?: MealWithVotes[] };
      setMeals(body.meals ?? []);
      setUpdatedAt(new Date());
    } finally {
      isRefreshing.current = false;
    }
  }

  useEffect(() => {
    let unsubscribeRealtime: (() => void) | null = null;

    async function setupRealtime() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        return;
      }

      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const channel = supabase
        .channel("topplista-live")
        .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, () => {
          void refreshTopplista();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "meals" }, () => {
          void refreshTopplista();
        })
        .subscribe();

      unsubscribeRealtime = () => {
        void supabase.removeChannel(channel);
      };
    }

    void setupRealtime();
    void refreshTopplista();

    const interval = window.setInterval(() => {
      void refreshTopplista();
    }, 1000);

    const onFocus = () => void refreshTopplista();
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      unsubscribeRealtime?.();
    };
  }, []);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-slate-600">
        <span>Live + uppdateras varje sekund</span>
        <span>{updatedAt ? `Senast ${updatedAt.toLocaleTimeString("sv-SE")}` : "Live"}</span>
      </div>

      <div className="mb-4 rounded-2xl bg-slate-950 px-5 py-4 text-white">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-200">Totalt registrerat</p>
        <p className="mt-1 text-3xl font-black">{totalVotes} röster</p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-soft backdrop-blur">
        {meals.length === 0 ? (
          <p className="p-8 text-center text-lg font-bold text-slate-700">Inga maträtter att visa än.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {meals.map((meal, index) => (
              <article
                className="grid grid-cols-[auto_1fr] gap-4 p-4 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] sm:items-center sm:p-5"
                key={meal.id}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl font-black text-amber-900">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">{meal.name}</h2>
                  <p className="text-sm font-bold text-slate-500">{meal.week}</p>
                </div>
                <Stat label="Totalt" value={`${meal.total}`} />
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
