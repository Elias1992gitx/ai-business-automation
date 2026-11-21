import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const supabase = await createClient();
    // 1. Terminate Supabase session globally
    await supabase.auth.signOut({ scope: "global" });
  } catch (err) {
    console.error("Supabase signOut error:", err);
  }

  // 2. Clear any lingering cookies explicitly
  const cookieStore = await cookies();
  cookieStore.delete("ai_automation_demo_session");

  return NextResponse.json({ success: true, message: "Signed out successfully" });
}
