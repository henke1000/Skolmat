import { AppNav } from "@/components/AppNav";
import { SetupError } from "@/components/SetupError";
import { getMealsWithVotes } from "@/lib/meals";

export const dynamic = "force-dynamic";

export default async function TopplistaPage() {
  try {
    const meals = await getMealsWithVotes();

    return (
      <>
        <AppNav />
        <main className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
        <section className="py-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">Resultat</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 sm:text-5xl">Topplista</h1>
        </section>

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
        </main>
      </>
    );
  } catch (error) {
    return (
      <>
        <AppNav />
        <SetupError message={error instanceof Error ? error.message : "Okänt serverfel."} />
      </>
    );
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left sm:text-center">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}
