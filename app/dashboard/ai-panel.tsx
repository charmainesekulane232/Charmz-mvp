"use client";

import { useState } from "react";

type HealthBreakdown = { label: string; score: number };
type Insight = {
  title: string;
  detail: string;
  severity: "critical" | "watch" | "positive";
};
type Analysis = {
  categories: { category: string; total: number }[];
  safe_to_spend: number;
  cash_runway_days: number;
  business_health_score: number;
  health_breakdown: HealthBreakdown[];
  insights: Insight[];
  summary: string;
};

const severityColor: Record<Insight["severity"], string> = {
  critical: "border-l-red-500 bg-red-500/5",
  watch: "border-l-orange-400 bg-orange-400/5",
  positive: "border-l-blue-400 bg-blue-400/5",
};

const severityBadge: Record<Insight["severity"], string> = {
  critical: "bg-red-500/20 text-red-300",
  watch: "bg-orange-400/20 text-orange-300",
  positive: "bg-blue-400/20 text-blue-300",
};

export default function AiPanel() {
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Analysis failed.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("Could not reach the AI service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">AI Financial Intelligence</h2>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-accent px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Analyzing..." : data ? "Re-analyze" : "Run AI Analysis"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 mb-4">
          {error}
        </p>
      )}

      {!data && !error && !loading && (
        <p className="text-sm text-gray-500">
          Turn your raw transactions into a living intelligence layer — safe
          to spend, runway, business health, and risks before they become
          crises.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 bg-card rounded-lg p-4">
            {data.summary}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase">
                Safe to Spend
              </p>
              <p className="text-2xl font-bold mt-1">
                R{data.safe_to_spend?.toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase">Cash Runway</p>
              <p className="text-2xl font-bold mt-1">
                {data.cash_runway_days} days
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-accent">
                {data.business_health_score}
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <p className="text-sm text-gray-400">Business Health Score</p>
            </div>
            <div className="space-y-2">
              {data.health_breakdown?.map((h) => (
                <div key={h.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-40 shrink-0">
                    {h.label}
                  </span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        h.score >= 75
                          ? "bg-green-500"
                          : h.score >= 50
                          ? "bg-orange-400"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${h.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-8 text-right">
                    {h.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
              Proactive Insights
            </h3>
            <div className="space-y-2">
              {data.insights?.map((insight, i) => (
                <div
                  key={i}
                  className={`border-l-4 rounded-r-lg p-4 ${
                    severityColor[insight.severity]
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-sm">{insight.title}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                        severityBadge[insight.severity]
                      }`}
                    >
                      {insight.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {insight.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
