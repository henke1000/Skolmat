"use client";

import { useEffect, useMemo, useState } from "react";
import type { Meal, VoteValue } from "@/lib/types";
import { getOrCreateVoterId, hasLocalVote, rememberLocalVote } from "@/lib/voter";

type VoteDeckProps = {
  meals: Meal[];
};

export function VoteDeck({ meals }: VoteDeckProps) {
  const [ready, setReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const visibleMeals = useMemo(
    () => (ready ? meals.filter((meal) => !hasLocalVote(meal.id)) : meals),
    [meals, ready]
  );
  const meal = visibleMeals[currentIndex];

  useEffect(() => {
    getOrCreateVoterId();
    setReady(true);
  }, []);

  async function submitVote(vote: VoteValue) {
    if (!meal || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mealId: meal.id,
        voterId: getOrCreateVoterId(),
        vote
      })
    });

    if (response.ok || response.status === 409) {
      rememberLocalVote(meal.id);
      setCurrentIndex((index) => index + 1);
      setDragX(0);
    } else {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(body?.message ?? "Rösten kunde inte sparas just nu.");
    }

    setIsSubmitting(false);
  }

  function endDrag() {
    if (dragX > 90) {
      void submitVote("like");
    } else if (dragX < -90) {
      void submitVote("dislike");
    } else {
      setDragX(0);
    }

    setStartX(null);
  }

  if (!ready) {
    return <div className="mt-20 text-center text-lg font-bold text-slate-700">Laddar...</div>;
  }

  if (meals.length === 0) {
    return (
      <section className="mx-auto mt-16 max-w-xl px-4 text-center">
        <div className="text-6xl">🍽️</div>
        <h1 className="mt-6 text-3xl font-black text-slate-950">Inga maträtter än</h1>
        <p className="mt-3 text-base font-medium text-slate-700">Lägg till veckans mat på adminsidan.</p>
      </section>
    );
  }

  if (!meal) {
    return (
      <section className="mx-auto mt-16 max-w-xl px-4 text-center">
        <div className="text-7xl">🎉</div>
        <h1 className="mt-6 text-4xl font-black text-slate-950">Tack för dina röster!</h1>
      </section>
    );
  }

  const rotate = dragX / 18;
  const likeOpacity = Math.max(0, Math.min(1, dragX / 110));
  const dislikeOpacity = Math.max(0, Math.min(1, -dragX / 110));

  return (
    <main className="mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-5xl flex-col items-center justify-center px-4 pb-8">
      <div className="mb-5 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">{meal.week}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Veckans skolmat</h1>
      </div>

      <div className="relative h-[430px] w-full max-w-sm sm:max-w-md">
        <div className="absolute inset-5 rotate-3 rounded-[28px] bg-rose-200/80" />
        <div className="absolute inset-3 -rotate-2 rounded-[28px] bg-emerald-200/80" />
        <article
          className="touch-pan-y absolute inset-0 flex select-none flex-col justify-between rounded-[28px] border border-white/80 bg-white p-7 shadow-soft transition-transform duration-150"
          onPointerDown={(event) => setStartX(event.clientX)}
          onPointerMove={(event) => {
            if (startX !== null) {
              setDragX(event.clientX - startX);
            }
          }}
          onPointerCancel={endDrag}
          onPointerUp={endDrag}
          style={{
            transform: `translateX(${dragX}px) rotate(${rotate}deg)`
          }}
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900">
              Kort {currentIndex + 1}/{visibleMeals.length}
            </span>
            <span className="text-5xl">🥗</span>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-full bg-teal-100 text-6xl">
              🍲
            </div>
            <h2 className="text-4xl font-black leading-tight text-slate-950">{meal.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-center text-lg font-black text-rose-700"
              style={{ opacity: Math.max(0.35, dislikeOpacity) }}
            >
              👎 Gillar inte
            </div>
            <div
              className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-lg font-black text-emerald-700"
              style={{ opacity: Math.max(0.35, likeOpacity) }}
            >
              ❤️ Gillar
            </div>
          </div>
        </article>
      </div>

      <div className="mt-7 grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md">
        <button
          className="rounded-2xl bg-slate-950 px-4 py-5 text-lg font-black text-white shadow-lg disabled:opacity-60"
          disabled={isSubmitting}
          onClick={() => void submitVote("dislike")}
          type="button"
        >
          👎 Gillar inte
        </button>
        <button
          className="rounded-2xl bg-emerald-500 px-4 py-5 text-lg font-black text-white shadow-lg disabled:opacity-60"
          disabled={isSubmitting}
          onClick={() => void submitVote("like")}
          type="button"
        >
          ❤️ Gillar
        </button>
      </div>

      {message ? <p className="mt-4 text-center text-sm font-bold text-rose-700">{message}</p> : null}
    </main>
  );
}
