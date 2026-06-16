import { AppNav } from "@/components/AppNav";
import { SetupError } from "@/components/SetupError";
import { VoteDeck } from "@/components/VoteDeck";
import { getCurrentWeekMeals } from "@/lib/meals";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const meals = await getCurrentWeekMeals();

    return (
      <>
        <AppNav />
        <VoteDeck meals={meals} />
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
