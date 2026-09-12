import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([name, value]) =>
            response.headers.set(name, value),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const pathname = request.nextUrl.pathname;
  const isAuthenticated = Boolean(claims?.sub);
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");
  const isPublicRoute =
    pathname === "/" || isAuthRoute || pathname.startsWith("/auth/");

  if (isAuthenticated && isAuthRoute) {
    return redirectWithSession(request, response, "/dashboard");
  }

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return redirectWithSession(request, response, loginUrl);
  }

  return response;
}

function redirectWithSession(
  request: NextRequest,
  sessionResponse: NextResponse,
  destination: string | URL,
) {
  const redirectUrl = typeof destination === "string"
    ? new URL(destination, request.url)
    : destination;
  const redirectResponse = NextResponse.redirect(redirectUrl);

  sessionResponse.cookies.getAll().forEach(({ name, value }) =>
    redirectResponse.cookies.set(name, value),
  );

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = sessionResponse.headers.get(header);
    if (value) redirectResponse.headers.set(header, value);
  }

  return redirectResponse;
}
