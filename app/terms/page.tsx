export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-gray-300">
      <h1 className="text-2xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold mb-2">
            What Charmz.ai is
          </h2>
          <p>
            Charmz.ai is a software tool that helps you visualize and
            understand your own financial data. It processes the bank
            transaction data you upload and generates informational
            insights, categorization, and estimates.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            Not financial advice
          </h2>
          <p>
            Charmz.ai does not provide financial, tax, investment, or legal
            advice. All numbers, estimates, and insights shown (including
            &quot;safe to spend,&quot; tax reserve estimates, and business
            health scores) are informational approximations generated from
            the data you provide and should not be relied on as a substitute
            for professional financial or tax advice. Always consult a
            qualified accountant or financial advisor for decisions
            affecting your business.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            Early-stage product
          </h2>
          <p>
            Charmz.ai is an early MVP under active development. Features may
            change, and you may encounter bugs or incomplete functionality.
            By using it, you understand you are testing an early-stage
            product, not a finished commercial service.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">
            Your responsibilities
          </h2>
          <p>
            You are responsible for the accuracy of the data you upload and
            for keeping your account credentials secure. Only upload bank
            statement data you are authorized to use.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-2">Contact</h2>
          <p>
            Questions about these terms can be directed to the Charmz.ai
            founder directly.
          </p>
        </section>
      </div>
    </div>
  );
}
