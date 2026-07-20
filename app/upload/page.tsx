"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/client";

// Adjust these to match your bank's actual CSV column headers.
// Capitec/FNB/Nedbank/Absa/Standard Bank each export slightly differently —
// check one real exported file and update the keys below.
type CsvRow = {
  Date: string;
  Description: string;
  Amount: string;
};

export default function UploadPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("Parsing CSV...");

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            setStatus("You must be logged in.");
            setLoading(false);
            return;
          }

          const rows = results.data
            .filter((r) => r.Date && r.Amount)
            .map((r) => ({
              user_id: user.id,
              date: r.Date,
              description: r.Description ?? "Unknown",
              amount: parseFloat(r.Amount.replace(/[^0-9.-]/g, "")),
            }));

          if (rows.length === 0) {
            setStatus(
              "No valid rows found. Check that your CSV has Date, Description, Amount columns."
            );
            setLoading(false);
            return;
          }

          const { error } = await supabase.from("transactions").insert(rows);

          if (error) {
            setStatus(`Error saving: ${error.message}`);
            setLoading(false);
            return;
          }

          setStatus(`Imported ${rows.length} transactions.`);
          setLoading(false);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1000);
        } catch (err) {
          setStatus("Something went wrong parsing that file.");
          setLoading(false);
        }
      },
      error: () => {
        setStatus("Could not parse that file.");
        setLoading(false);
      },
    });
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">Upload Bank Statement</h1>
      <p className="text-gray-400 mb-8">
        CSV from Capitec, FNB, Nedbank, Absa, or Standard Bank.
      </p>

      <label className="block border-2 border-dashed border-gray-700 rounded-xl p-10 text-center cursor-pointer hover:border-accent transition">
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
          disabled={loading}
        />
        <span className="text-gray-300">
          {loading ? "Working..." : "Tap to choose a CSV file"}
        </span>
      </label>

      {status && <p className="mt-6 text-sm text-gray-300">{status}</p>}
    </div>
  );
}
