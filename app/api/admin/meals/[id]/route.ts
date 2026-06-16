import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isAllowed(key: string | null) {
  return Boolean(process.env.ADMIN_KEY && key === process.env.ADMIN_KEY);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);

  if (!isAllowed(searchParams.get("key"))) {
    return NextResponse.json({ message: "Fel admin-kod." }, { status: 401 });
  }

  const { error } = await supabase.from("meals").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
