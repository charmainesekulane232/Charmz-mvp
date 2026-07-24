"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name")
        .eq("id", user.id)
        .single();

      setBusinessName(profile?.business_name ?? "");
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
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
      .update({ business_name: businessName })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="relative w-10 h-10 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-gray-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        </div>
        <p className="text-gray-400 text-sm">Loading settings...</p>
      </div>
    );
  }

  if (signingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-700 to-blue-900">
        <div className="relative w-14 h-14 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
        </div>
        <p className="text-white/90 text-sm">Signing you out...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12 pb-24">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile section */}
      <section className="mb-10">
        <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
          Profile
        </h2>
        <div className="bg-card rounded-xl p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <p className="text-sm text-gray-300">{email}</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Business name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg bg-background border border-gray-700 px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {saved && (
              <p className="text-green-400 text-xs">Saved.</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bg-accent px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </section>

      {/* Security section */}
      <section className="mb-10">
        <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
          Security
        </h2>
        <div className="bg-card rounded-xl divide-y divide-gray-800">
          <a
            href="/login"
            className="flex items-center justify-between px-5 py-4 text-sm text-gray-300"
          >
            Change password
            <span className="text-gray-600">›</span>
          </a>
          <a
            href="/privacy"
            className="flex items-center justify-between px-5 py-4 text-sm text-gray-300"
          >
            Privacy Policy
            <span className="text-gray-600">›</span>
          </a>
          <a
            href="/terms"
            className="flex items-center justify-between px-5 py-4 text-sm text-gray-300"
          >
            Terms of Service
            <span className="text-gray-600">›</span>
          </a>
        </div>
        <p className="text-xs text-gray-600 mt-3 px-1">
          🔒 Bank-level data isolation — your data is never shared
        </p>
      </section>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full text-red-400 text-sm font-medium py-3 rounded-lg border border-red-500/20 bg-red-500/5"
      >
        Sign Out
      </button>
    </div>
  );
          }
