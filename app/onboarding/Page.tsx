"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SCREENS = [
  {
    key: "intro",
    headline: "Know your numbers before they know you.",
    body: "Your bank statements hold the truth about your business. We turn that raw data into something you can actually feel — clarity, control, and confidence in every decision.",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-700",
  },
  {
    key: "security",
    headline: "Your data stays yours. Always.",
    body: "Bank-level data isolation. Nothing shared, nothing sold. Every business's numbers live in their own locked room — not even we can see across accounts.",
    gradientFrom: "from-blue-700",
    gradientTo: "to-indigo-800",
  },
  {
    key: "ai",
    headline: "An AI that watches your back.",
    body: "Safe-to-spend, cash runway, business health score, and risks flagged before they become crises. Not a report you read once — a co-pilot that thinks about your money so you don't have to, every day.",
    gradientFrom: "from-indigo-700",
    gradientTo: "to-purple-800",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  function next() {
    if (step < SCREENS.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/signup");
    }
  }

  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-700 to-blue-900">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xl font-bold">C</span>
          </div>
        </div>
        <p className="text-white/90 text-sm tracking-wide">
          Charmz.ai
        </p>
      </div>
    );
  }

  const screen = SCREENS[step];

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-gradient-to-b ${screen.gradientFrom} ${screen.gradientTo} px-6 py-10`}
    >
      <div className="flex gap-2 mt-2">
        {SCREENS.map((s, i) => (
          <div
            key={s.key}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-white" : "bg-white/25"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto text-center">
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          {screen.headline}
        </h1>
        <p className="text-white/80 text-base leading-relaxed">
          {screen.body}
        </p>
      </div>

      <div className="max-w-sm w-full mx-auto">
        <button
          onClick={next}
          className="w-full bg-white text-indigo-900 font-semibold rounded-xl py-3.5 text-base"
        >
          {step < SCREENS.length - 1 ? "Continue" : "Get Started"}
        </button>
        {step < SCREENS.length - 1 && (
          <button
            onClick={() => router.push("/signup")}
            className="w-full text-white/60 text-sm mt-4"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
