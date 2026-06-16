import { AppNav } from "@/components/AppNav";
import { SetupError } from "@/components/SetupError";
import { TopplistaLive } from "@/components/TopplistaLive";
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

          <TopplistaLive initialMeals={meals} />
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
