import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/dashboard", "/upload"];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  // Not logged in, trying to hit a protected page → send to login
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in → check if they've completed personalization onboarding
  if (user && path !== "/welcome") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    const needsWelcome = profile && profile.onboarding_completed === false;

    // Only force the redirect if they're trying to reach a protected page
    if (needsWelcome && isProtected) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
