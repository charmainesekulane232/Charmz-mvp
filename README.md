# Charmz.ai MVP

Functional starter: auth, database with per-user security, CSV bank statement
upload, AI analysis, and a real dashboard. This replaces your dummy mockup
with working data.

## 1. Install

```bash
npm install
```

## 2. Set up Supabase (free, no card)

1. Go to supabase.com → New Project
2. Once created, go to the **SQL Editor** → New Query
3. Paste the entire contents of `supabase/schema.sql` → Run
4. Go to **Project Settings → API** → copy your Project URL, `anon` key,
   and `service_role` key

## 3. Set up Gemini (free, no card)

1. Go to ai.google.dev → "Get API Key" → create a key
2. This gives you 1,500 free requests/day, no expiry

## 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Paste in your real Supabase and Gemini keys.

## 5. Run it

```bash
npm run dev
```

Open http://localhost:3000 — you'll land on `/login`. Click "Sign up",
create an account, then you're in the dashboard.

## 6. Test the core flow

1. Sign up → lands on empty dashboard
2. Click "+ Upload" → choose a CSV bank statement
   - **Important**: open one real exported CSV from your bank first and
     check the actual column names. The upload page currently expects
     columns named `Date`, `Description`, `Amount` — edit
     `app/upload/page.tsx` if your bank's export uses different headers
     (e.g. some banks use "Transaction Date" or "Value").
3. After upload, you're redirected to the dashboard showing real numbers
   pulled from Supabase — not hardcoded ones

## 7. Wire up AI insights

The `/api/analyze` route is built and ready — it's not called from the UI
yet. Add a button on the dashboard that does:

```js
const res = await fetch("/api/analyze", { method: "POST" });
const insights = await res.json();
```

Then render `insights.categories`, `insights.insight`, and
`insights.safe_to_spend` wherever you'd like.

## 8. Add Paddle billing (once the above works)

1. Sign up at paddle.com, create a subscription product
2. In Paddle dashboard, point a webhook at:
   `https://your-deployed-url.com/api/paddle-webhook`
3. Add your Paddle checkout button/script to a `/pricing` page
4. The webhook handler already updates `profiles.is_pro` when someone
   subscribes — gate any premium features by checking that flag

## 9. Deploy

Push this to a GitHub repo, then import it at vercel.com (free tier).
Add the same environment variables in Vercel's project settings.

## Known gaps to fix before charging real customers

- CSV column mapping is hardcoded — different banks export differently
- Paddle webhook signature isn't verified yet (currently trusts any POST —
  fix this before going live, see the TODO comment in the route file)
- No duplicate-transaction detection on re-upload
