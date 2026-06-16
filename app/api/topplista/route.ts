import { NextResponse } from "next/server";
import { getMealsWithVotes } from "@/lib/meals";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const meals = await getMealsWithVotes();
    return NextResponse.json({ meals });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Kunde inte läsa topplistan." },
      { status: 500 }
    );
  }
}
