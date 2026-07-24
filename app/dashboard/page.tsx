import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AiPanel from "./ai-panel";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  const rows = transactions ?? [];

  const revenue = rows
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = rows
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const profit = revenue - expenses;
  const firstName = user?.email?.split("@")[0];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            AI Financial Intelligence
          </p>
          <h1 className="text-2xl font-bold">Charmz.ai</h1>
        </div>
        <Link
          href="/upload"
          className="bg-accent px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + Upload
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-300 text-lg font-medium mb-2">
            Welcome{firstName ? `, ${firstName}` : ""}.
          </p>
          <p className="text-gray-500 mb-6">
            Upload a bank statement to get your first business health
            snapshot.
          </p>
          <Link
            href="/upload"
            className="bg-accent px-5 py-2.5 rounded-lg text-sm font-semibold inline-block"
          >
            Upload your first bank statement
          </Link>
          <p className="text-xs text-gray-600 mt-4">
            🔒 Bank-level data isolation — your data is never shared
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold mt-1">
                R{revenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase">
                Monthly Expenses
              </p>
              <p className="text-2xl font-bold mt-1">
                R{expenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-xl p-5 col-span-2">
              <p className="text-xs text-gray-400 uppercase">Profit</p>
              <p className="text-2xl font-bold mt-1">
                R{profit.toLocaleString()}
              </p>
            </div>
          </div>

          <AiPanel />

          <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
          <div className="space-y-2">
            {rows.slice(0, 10).map((t) => (
              <div
                key={t.id}
                className="bg-card rounded-lg px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm">{t.description}</p>
                  <p className="text-xs text-gray-500">{t.date}</p>
                </div>
                <p
                  className={
                    t.amount < 0 ? "text-red-400" : "text-green-400"
                  }
                >
                  {t.amount < 0 ? "-" : "+"}R
                  {Math.abs(Number(t.amount)).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    <        </>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-gray-800">
        <div className="max-w-2xl mx-auto flex justify-around py-3">

          <Link
            href="/dashboard"
            className="flex flex-col items-center text-purple-400 text-xs"
          >
            <span className="text-xl">🏠</span>
            Dashboard
          </Link>

          <Link
            href="/upload"
            className="flex flex-col items-center text-gray-400 text-xs"
          >
            <span className="text-xl">📤</span>
            Upload
          </Link>

          <Link
            href="/insights"
            className="flex flex-col items-center text-gray-400 text-xs"
          >
            <span className="text-xl">📊</span>
            Insights
          </Link>

          <Link
            href="/settings"
            className="flex flex-col items-center text-gray-400 text-xs"
          >
            <span className="text-xl">⚙️</span>
            Settings
          </Link>

        </div>
      </nav>

    </div>
  );
}
