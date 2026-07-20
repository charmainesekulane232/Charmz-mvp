import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Calls Google Gemini's free tier to categorize transactions and
// generate a "Safe to Spend" style insight.
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

  const prompt = `You are a financial analyst. Here is a list of bank transactions in JSON:
${JSON.stringify(transactions)}

Return ONLY valid JSON (no markdown, no backticks) in this exact shape:
{
  "categories": [{"category": "string", "total": number}],
  "insight": "one sentence, plain language financial insight for a small business owner",
  "safe_to_spend": number
}`;

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
