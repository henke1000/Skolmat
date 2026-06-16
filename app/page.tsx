import { AppNav } from "@/components/AppNav";
import { VoteDeck } from "@/components/VoteDeck";
import { getCurrentWeekMeals } from "@/lib/meals";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const meals = await getCurrentWeekMeals();

  return (
    <>
      <AppNav />
      <VoteDeck meals={meals} />
    </>
  );
}
