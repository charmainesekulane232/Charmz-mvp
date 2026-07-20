import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Paddle sends events here when someone subscribes/cancels.
// In Paddle dashboard: Developer Tools -> Notifications -> add this route's public URL.
// This uses the SERVICE ROLE key (server-only, bypasses RLS) because webhooks
// have no logged-in user session — never expose this key to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  // TODO: verify Paddle's webhook signature here before trusting the payload.
  // See: https://developer.paddle.com/webhooks/signature-verification

  const eventType = body.event_type;
  const customerEmail = body.data?.customer?.email;

  if (!customerEmail) {
    return NextResponse.json({ received: true });
  }

  if (eventType === "subscription.created" || eventType === "subscription.activated") {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const matchedUser = userData?.users.find((u) => u.email === customerEmail);

    if (matchedUser) {
      await supabaseAdmin
        .from("profiles")
        .update({
          is_pro: true,
          paddle_customer_id: body.data?.customer?.id ?? null,
        })
        .eq("id", matchedUser.id);
    }
  }

  if (eventType === "subscription.canceled") {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const matchedUser = userData?.users.find((u) => u.email === customerEmail);

    if (matchedUser) {
      await supabaseAdmin
        .from("profiles")
        .update({ is_pro: false })
        .eq("id", matchedUser.id);
    }
  }

  return NextResponse.json({ received: true });
}
