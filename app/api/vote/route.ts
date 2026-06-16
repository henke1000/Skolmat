import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { VoteValue } from "@/lib/types";

type VoteBody = {
  mealId?: string;
  vote?: VoteValue;
  voterId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as VoteBody;

  if (!body.mealId || !body.voterId || !["like", "dislike"].includes(body.vote ?? "")) {
    return NextResponse.json({ message: "Ogiltig röst." }, { status: 400 });
  }

  const { error } = await supabase.from("votes").insert({
    meal_id: body.mealId,
    voter_id: body.voterId,
    vote: body.vote
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Du har redan röstat på den här maträtten." }, { status: 409 });
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
