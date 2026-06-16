import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isAllowed(key: string | null) {
  return Boolean(process.env.ADMIN_KEY && key === process.env.ADMIN_KEY);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);

    if (!isAllowed(searchParams.get("key"))) {
      return NextResponse.json({ message: "Fel admin-kod." }, { status: 401 });
    }

    const supabase = await getSupabase();
    const { error } = await supabase.from("meals").delete().eq("id", params.id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Kunde inte ta bort maträtten." },
      { status: 500 }
    );
  }
}
