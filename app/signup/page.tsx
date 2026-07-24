"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] =useState<string | null>(null);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    if (!agreed) {
      setLoading(false);
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Check if the user has a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setLoading(false);

    if (!session) {
      setError(
        "Please verify your email first, then log in."
      );
      return;
    }

    setRedirecting(true);

    router.replace("/welcome");
    router.refresh();
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-700 to-blue-900">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-white border-t-transparent animate-spin"></div>

          <h1 className="text-3xl font-bold text-white">
            Charmz.ai
          </h1>

          <p className="mt-2 text-white/80">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-1">
          Charmz.ai
        </h1>

        <p className="text-gray-400 mb-8">
          Create your account
        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-card border border-gray-700 px-4 py-3 outline-none focus:border-accent"
          />

          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-card border border-gray-700 px-4 py-3 outline-none focus:border-accent"
          />

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-accent"
            />

            <span className="text-xs text-gray-400">
              I agree to the{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full rounded-lg bg-accent py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}
