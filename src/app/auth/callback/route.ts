import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Google/Supabase did not return an authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL("/account?error=missing_code", requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();

    // Exchange Google's authorization code
    // for a Supabase authenticated session.
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "SUPABASE AUTH CALLBACK ERROR:",
        error
      );

      return NextResponse.redirect(
        new URL(
          "/account?error=auth_callback",
          requestUrl.origin
        )
      );
    }

    // Successful Google login.
    // The Supabase session is now stored in the browser cookies
    // through the server Supabase client.
    return NextResponse.redirect(
      new URL("/", requestUrl.origin)
    );
  } catch (error) {
    console.error(
      "AUTH CALLBACK UNEXPECTED ERROR:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/account?error=auth_callback",
        requestUrl.origin
      )
    );
  }
}