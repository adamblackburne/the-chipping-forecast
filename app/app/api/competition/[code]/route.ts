import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ code: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { code } = await params;

  const { data: comp, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("join_code", code.toUpperCase())
    .single();

  if (error || !comp) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ competition: comp });
}
