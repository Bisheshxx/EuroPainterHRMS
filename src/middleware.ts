import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "../utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    const response = await updateSession(request);
    return response;
  } catch (error) {
    console.error("🔴 MIDDLEWARE ERROR:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
