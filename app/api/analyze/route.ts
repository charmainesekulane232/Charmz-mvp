import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // TEMPORARY TEST: skip Gemini entirely, return fake data to confirm the pipeline works
  return NextResponse.json({
    categories: [{ category: "Test", total: 100 }],
    safe_to_spend: 12345,
    cash_runway_days: 47,
    business_health_score: 83,
    health_breakdown: [{ label: "Test Score", score: 90 }],
    insights: [
      { title: "This is a test", detail: "If you see this, the pipeline works", severity: "positive" },
    ],
    summary: "TEST MODE — Gemini is bypassed right now.",
  });
}
