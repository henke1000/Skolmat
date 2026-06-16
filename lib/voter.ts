const VOTER_KEY = "skolmat:voter-id";

export function getOrCreateVoterId() {
  const existing = window.localStorage.getItem(VOTER_KEY);

  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(VOTER_KEY, generated);
  return generated;
}

export function rememberLocalVote(mealId: string) {
  window.localStorage.setItem(`skolmat:voted:${mealId}`, "true");
}

export function hasLocalVote(mealId: string) {
  return window.localStorage.getItem(`skolmat:voted:${mealId}`) === "true";
}
