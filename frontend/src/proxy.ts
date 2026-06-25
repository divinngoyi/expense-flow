import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/forgot-password(.*)",
  "/api/webhook(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
  "/forgot-password(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Authenticated users visiting auth pages go straight to dashboard
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
