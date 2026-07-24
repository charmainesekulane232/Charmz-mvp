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

  async function handleSubmit(e: React.FormEvent) {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-700 to-blue-900">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xl font-bold">C</span>
          </div>
        </div>
        <p className="text-white/90 text-sm tracking-wide">Charmz.ai</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Let&apos;s set you up</h1>
        <p className="text-gray-400 mb-8">
          Two quick things so your dashboard actually feels like yours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase mb-2 block">
              What&apos;s your business called?
            </label>
