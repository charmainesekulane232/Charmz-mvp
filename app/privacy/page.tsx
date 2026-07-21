export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-gray-300">
      <h1 className="text-2xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold mb-2">What we collect</h2>
          <p>
            When you use Charmz.ai, we collect your email address (for your
            account), and the transaction data you choose to upload (date,
            description, and amount from your bank statement CSV).
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            How your data is protected
          </h2>
          <p>
            Your transaction data is stored in a private, per-account database
            record. We use Row Level Security, a database-level protection
            that mathematically restricts every query so your account can
            only ever read or write your own data — not just at the
            application level, but enforced by the database itself. No other
            user, including other Charmz.ai users, can access your
            transactions.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            What we don&apos;t do
          </h2>
          <p>
            We do not sell your data to third parties. We do not share your
            individual transaction data with anyone outside of the AI
            analysis described below. We do not use your data to train AI
            models beyond the single analysis request you trigger.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            Third-party AI processing
          </h2>
          <p>
            When you tap &quot;Run AI Analysis,&quot; your transaction data
            (date, description, and amount only — no bank account numbers or
            personal identifiers) is sent to Google&apos;s Gemini API to
            generate your financial insights. This happens only when you
            explicitly request it.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            Deleting your data
          </h2>
          <p>
            You can request deletion of your account and all associated data
            at any time by contacting us. We will remove your data within a
            reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            Questions
          </h2>
          <p>
            This is an early-stage MVP built by a solo founder. If you have
            questions or concerns about your data, please reach out directly
            — we take this seriously and are happy to explain any part of
            this in more detail.
          </p>
        </section>
      </div>
    </div>
  );
}
