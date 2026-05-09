import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/admin"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  const isAdminRoute = adminRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute && user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("userId", user.id)
      .single();

    const role = profile?.role;

    console.log(
      `Middleware Debug: path=${path}, userId=${user.id}, role=${role}, error=${error?.message || "none"}`,
    );

    if (role !== "admin" && role !== "media") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Restrict media role from sensitive admin routes
    const sensitiveRoutes = ["/admin/members", "/admin/donations"];
    if (
      role === "media" &&
      sensitiveRoutes.some(
        (route) => path === route || path.startsWith(`${route}/`),
      )
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if ((path === "/auth/login" || path === "/auth/register") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("userId", user.id)
      .single();

    if (profile?.role === "admin" || profile?.role === "media") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
