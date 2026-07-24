"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WelcomePage() {
  const router = useRouter();

  const [showLogo, setShowLogo] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [biggestWorry, setBiggestWorry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Something went wrong. Please log in again.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        biggest_worry: biggestWorry,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (showLogo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-700 to-blue-900">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          <h1 className="text-3xl font-bold text-white">Charmz.ai</h1>
          <p className="mt-2 text-white/80">
            Preparing your AI Financial Co-Pilot...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-xl">

        <h1 className="mb-2 text-2xl font-bold">
          Let's set you up
        </h1>

        <p className="mb-6 text-gray-400">
          Two quick questions before we build your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm">
              Business Name
            </label>

            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Acme Consulting"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              What's your biggest financial worry?
            </label>

            <textarea
              value={biggestWorry}
              onChange={(e) => setBiggestWorry(e.target.value)}
              placeholder="Cash flow, taxes, late payments..."
              rows={4}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/20 p-3 text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue to Dashboard"}
          </button>

        </form>

      </div>
    </div>
  );
}


