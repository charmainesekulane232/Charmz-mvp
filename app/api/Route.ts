import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Calls Google Gemini's free tier to run full AI CFO analysis:
// categorization, safe-to-spend, business health score, and proactive risk insights.
// Get a free key (no credit card) at https://ai.google.dev
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("date, description, amount")
    .order("date", { ascending: false })
    .limit(100);

  if (!transactions || transactions.length === 0) {
    return NextResponse.json({ error: "No transactions found" }, { status: 400 });
  }

  const prompt = `You are an AI CFO analyzing a small business's raw bank transactions. Here is the transaction list in JSON:
${JSON.stringify(transactions)}

Analyze this like a financial operating system would: categorize spending, assess cash health, calculate runway, and surface risks before they become crises (e.g. client concentration, subscription bloat, shrinking runway).

Return ONLY valid JSON (no markdown, no backticks, no explanation) in this EXACT shape:
{
  "categories": [{"category": "string", "total": number}],
  "safe_to_spend": number,
  "cash_runway_days": number,
  "business_health_score": number,
  "health_breakdown": [
    {"label": "Cash Stability", "score": number},
    {"label": "Revenue Predictability", "score": number},
    {"label": "Client Risk", "score": number},
    {"label": "Burn Rate", "score": number}
  ],
  "insights": [
    {"title": "string", "detail": "string", "severity": "critical" | "watch" | "positive"}
  ],
  "summary": "one or two sentence plain-language business heartbeat summary"
}

Rules:
- business_health_score and all health_breakdown scores are 0-100.
- cash_runway_days is an estimate based on current cash position and average monthly burn.
- insights should surface 2-4 real patterns you find in the data (e.g. one client representing a large % of revenue, a rising expense category, tax reserve below a healthy ~25-28% of profit).
- Be specific with real numbers from the data, not generic advice.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Gemini analysis error:", err);
    return NextResponse.json(
      { error: "AI analysis failed. Check your GEMINI_API_KEY in .env.local" },
      { status: 500 }
    );
  }
}
