export type VoteValue = "like" | "dislike";

export type Meal = {
  id: string;
  name: string;
  week: string;
  created_at: string;
};

export type Vote = {
  id: string;
  meal_id: string;
  vote: VoteValue;
  voter_id: string;
  created_at: string;
};

export type MealWithVotes = Meal & {
  likes: number;
  dislikes: number;
  total: number;
  positivePercent: number;
};
