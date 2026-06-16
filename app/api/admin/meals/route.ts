import { NextResponse } from "next/server";
import { getMealsWithVotes } from "@/lib/meals";
import { supabase } from "@/lib/supabase";

function isAllowed(key: string | null) {
  return Boolean(process.env.ADMIN_KEY && key === process.env.ADMIN_KEY);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!isAllowed(searchParams.get("key"))) {
    return NextResponse.json({ message: "Fel admin-kod." }, { status: 401 });
  }

  const meals = await getMealsWithVotes();
  return NextResponse.json({ meals });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!isAllowed(searchParams.get("key"))) {
    return NextResponse.json({ message: "Fel admin-kod." }, { status: 401 });
  }

  const body = (await request.json()) as { name?: string; week?: string };
  const name = body.name?.trim();
  const week = body.week?.trim();

  if (!name || !week) {
    return NextResponse.json({ message: "Maträtt och vecka krävs." }, { status: 400 });
  }

  const { error } = await supabase.from("meals").insert({ name, week });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
