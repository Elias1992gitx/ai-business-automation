import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do not run any logic between createServerClient and getUser().
  // getUser() validates the JWT against Supabase Auth server and refreshes expired tokens.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const pathname = request.nextUrl.pathname;

  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/processes") ||
    pathname.startsWith("/recommendations") ||
    pathname.startsWith("/workflows") ||
    pathname.startsWith("/executions") ||
    pathname.startsWith("/settings");

  const isProtectedApi =
    pathname.startsWith("/api/processes") ||
    pathname.startsWith("/api/workflows") ||
    pathname.startsWith("/api/executions") ||
    pathname.startsWith("/api/recommendations") ||
    pathname.startsWith("/api/integrations");

  const isAuthPath = pathname === "/login" || pathname === "/signup";

  // If unauthenticated user tries to call protected API routes, return 401
  if (isProtectedApi && !user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication session required." },
      { status: 401 }
    );
  }

  // If unauthenticated user tries to access protected app routes, redirect to /login
  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user visits login or signup, redirect to /dashboard
  if (isAuthPath && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
