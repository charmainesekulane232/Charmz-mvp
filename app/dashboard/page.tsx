import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
          <p className="text-gray-400 mb-4">
            No transactions yet, {user?.email}.
          </p>
          <Link href="/upload" className="text-accent underline">
            Upload your first bank statement
          </Link>
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
    </div>
  );
}
