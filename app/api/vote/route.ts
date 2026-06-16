import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { VoteValue } from "@/lib/types";

export const dynamic = "force-dynamic";

type VoteBody = {
  mealId?: string;
  vote?: VoteValue;
  voterId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VoteBody;

    if (!body.mealId || !body.voterId || !["like", "dislike"].includes(body.vote ?? "")) {
      return NextResponse.json({ message: "Ogiltig röst." }, { status: 400 });
    }

    const supabase = await getSupabase();
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
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Kunde inte spara rösten." },
      { status: 500 }
    );
  }
}
