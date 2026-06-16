import { getSupabase } from "@/lib/supabase";
import type { Meal, MealWithVotes, Vote } from "@/lib/types";

export async function getMeals() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .order("week", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Meal[];
}

export async function getCurrentWeekMeals() {
  const meals = await getMeals();
  const latestWeek = meals[0]?.week;

  if (!latestWeek) {
    return [];
  }

  return meals.filter((meal) => meal.week === latestWeek);
}

export async function getMealsWithVotes() {
  const supabase = await getSupabase();
  const [{ data: meals, error: mealError }, { data: votes, error: voteError }] =
    await Promise.all([
      supabase.from("meals").select("*"),
      supabase.from("votes").select("*")
    ]);

  if (mealError) {
    throw new Error(mealError.message);
  }

  if (voteError) {
    throw new Error(voteError.message);
  }

  const voteRows = (votes ?? []) as Vote[];

  return ((meals ?? []) as Meal[])
    .map<MealWithVotes>((meal) => {
      const mealVotes = voteRows.filter((vote) => vote.meal_id === meal.id);
      const likes = mealVotes.filter((vote) => vote.vote === "like").length;
      const dislikes = mealVotes.filter((vote) => vote.vote === "dislike").length;
      const total = likes + dislikes;

      return {
        ...meal,
        likes,
        dislikes,
        total,
        positivePercent: total === 0 ? 0 : Math.round((likes / total) * 100)
      };
    })
    .sort((a, b) => {
      if (b.positivePercent !== a.positivePercent) {
        return b.positivePercent - a.positivePercent;
      }

      return b.likes - a.likes;
    });
}
