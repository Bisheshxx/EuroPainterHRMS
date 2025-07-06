import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
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
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(user);

  if (user && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (user && user.user_metadata.role !== "admin") {
    const pathname = request.nextUrl.pathname;

    // Allow access to /timesheet
    if (pathname === "/timesheet") {
      // allow
    }
    // Allow access to /setup-account
    else if (pathname === "/setup-account") {
      // allow - don't redirect
    }
    // Allow access to /employee/[id] only if [id] matches the user's id
    else if (
      pathname.startsWith("/employee/") &&
      pathname.split("/")[2] === user.id
    ) {
      // allow
    }
    // Otherwise, redirect to /timesheet
    else {
      return NextResponse.redirect(new URL("/timesheet", request.url));
    }
  }
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    // console.log(user, "this is the console log of users");
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return supabaseResponse;
}
