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

const UPLOAD_STEPS = [
  "Reading your file...",
  "Matching transactions...",
  "Saving securely...",
];

export default function UploadPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  function processFile(file: File) {
    setLoading(true);
    setStatus(null);
    setStepIndex(0);

    const stepTimer = setInterval(() => {
      setStepIndex((prev) =>
        prev < UPLOAD_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 700);

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
            clearInterval(stepTimer);
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
            clearInterval(stepTimer);
            setStatus(
              "No valid rows found. Check that your CSV has Date, Description, Amount columns."
            );
            setLoading(false);
            return;
          }

          const { error } = await supabase.from("transactions").insert(rows);

          clearInterval(stepTimer);

          if (error) {
            setStatus(`Error saving: ${error.message}`);
            setLoading(false);
            return;
          }

          setStepIndex(UPLOAD_STEPS.length - 1);
          setStatus(`Imported ${rows.length} transactions.`);
          setLoading(false);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1000);
        } catch (err) {
          clearInterval(stepTimer);
          setStatus("Something went wrong parsing that file.");
          setLoading(false);
        }
      },
      error: () => {
        clearInterval(stepTimer);
        setStatus("Could not parse that file.");
        setLoading(false);
      },
    });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">
        You already know the feeling.
      </h1>
      <p className="text-gray-400 mb-1">
        Checking your balance and hoping, instead of knowing. Most business
        owners find out they're in trouble only after it's too late to fix
        it.
      </p>
      <p className="text-gray-300 mb-6">
        Upload one bank statement. We'll show you exactly where you stand —
        today, not next quarter.
      </p>

      <div className="bg-card border border-gray-800 rounded-lg p-4 mb-6 text-sm text-gray-400">
        <p className="mb-1">
          <span className="text-gray-300 font-medium">
            Statement password-protected?
          </span>
        </p>
        <p>
          Open it in your banking app or PDF reader, enter your password to
          unlock it, then export/save as an unprotected CSV before
          uploading. We never see or store your bank password.
        </p>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
          dragActive
            ? "border-accent bg-accent/5"
            : "border-gray-700 hover:border-accent"
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center py-2">
            <div className="relative w-10 h-10 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-gray-800" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
            </div>
            <span className="text-gray-300 text-sm">
              {UPLOAD_STEPS[stepIndex]}
            </span>
          </div>
        ) : (
          <>
            <span className="text-gray-300 block mb-1">
              Drag your CSV here, or tap to choose a file
            </span>
            <span className="text-gray-600 text-xs">
              CSV from Capitec, FNB, Nedbank, Absa, or Standard Bank
            </span>
          </>
        )}
      </label>

      {status && <p className="mt-6 text-sm text-gray-300">{status}</p>}

      <p className="text-xs text-gray-600 mt-6 text-center">
        🔒 Bank-level data isolation — your data is never shared
      </p>
    </div>
  );
}
