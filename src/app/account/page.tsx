"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  Headphones,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type UserType = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [showEmailLogin, setShowEmailLogin] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // CHECK CURRENT USER
  // ============================================================

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user as UserType | null);
      } catch (error) {
        console.error(
          "ACCOUNT USER LOAD ERROR:",
          error
        );
      } finally {
        setCheckingUser(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          (session?.user as UserType | null) ?? null
        );
        setCheckingUser(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // DISPLAY NAME
  // ============================================================

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "NAVIRA Customer";

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    setError("");
    setGoogleLoading(true);

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              `${window.location.origin}/auth/callback`,
          },
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Google login failed."
      );

      setGoogleLoading(false);
    }
  };

  // ============================================================
  // EMAIL LOGIN
  // ============================================================

  const handleEmailLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        throw error;
      }

      setUser(
        (data.user as UserType | null) ?? null
      );

      router.refresh();
    } catch (error) {
      console.error(
        "ACCOUNT LOGIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setShowEmailLogin(false);
      setEmail("");
      setPassword("");

      router.refresh();
    } catch (error) {
      console.error(
        "ACCOUNT LOGOUT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not log out."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // ============================================================
  // LOADING USER
  // ============================================================

  if (checkingUser) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] pb-24 px-4 py-10 text-[#172033] md:pb-0 md:px-6 md:py-12">

        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#d7dfeb] border-t-[#c8102e]" />

            <p className="mt-4 text-sm text-[#708099]">
              Loading your account...
            </p>

          </div>

        </div>

      </main>
    );
  }

  // ============================================================
  // LOGGED-IN ACCOUNT
  // ============================================================

  if (user) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#f5f7fb] pb-24 text-[#172033] md:pb-0">

        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 md:px-10 md:py-16">

          {/* HEADER */}

          <div className="rounded-2xl border border-[#d7dfeb] bg-white p-5 shadow-[0_12px_35px_rgba(20,35,55,0.06)] sm:p-7 md:rounded-[26px]">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#172033] text-xl font-semibold text-white">
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="min-w-0">

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7b899d]">
                  NAVIRA ACCOUNT
                </p>

                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight">
                  {displayName}
                </h1>

                <p className="mt-1 truncate text-sm text-[#65748a]">
                  {user.email}
                </p>

              </div>

            </div>

          </div>


          {/* ACCOUNT OPTIONS */}

          <div className="mt-6 space-y-3">

            {/* MY ORDERS */}

            <Link
              href="/account/orders"
              className="group flex items-center gap-4 rounded-2xl border border-[#d7dfeb] bg-white p-5 shadow-[0_8px_25px_rgba(20,35,55,0.04)] transition hover:border-[#c0cad8] hover:shadow-[0_12px_30px_rgba(20,35,55,0.08)]"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f8] text-[#172033]">
                <ShoppingBag
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-sm font-semibold">
                  My Orders
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#718097]">
                  View your order history and order status.
                </p>

              </div>

              <ChevronRight
                size={19}
                className="shrink-0 text-[#8b98aa] transition-transform group-hover:translate-x-1"
              />

            </Link>


            {/* PROFILE */}

            <Link
              href="/account/profile"
              className="group flex items-center gap-4 rounded-2xl border border-[#d7dfeb] bg-white p-5 shadow-[0_8px_25px_rgba(20,35,55,0.04)] transition hover:border-[#c0cad8] hover:shadow-[0_12px_30px_rgba(20,35,55,0.08)]"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f8] text-[#172033]">
                <MapPin
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-sm font-semibold">
                  Profile & Addresses
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#718097]">
                  Manage your personal details and saved addresses.
                </p>

              </div>

              <ChevronRight
                size={19}
                className="shrink-0 text-[#8b98aa] transition-transform group-hover:translate-x-1"
              />

            </Link>


            {/* SUPPORT */}

            <a
              href="https://wa.me/918660215764"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#d7dfeb] bg-white p-5 shadow-[0_8px_25px_rgba(20,35,55,0.04)] transition hover:border-[#c0cad8] hover:shadow-[0_12px_30px_rgba(20,35,55,0.08)]"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1f4f8] text-[#172033]">
                <Headphones
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-sm font-semibold">
                  Support
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#718097]">
                  Contact NAVIRA through WhatsApp.
                </p>

              </div>

              <ChevronRight
                size={19}
                className="shrink-0 text-[#8b98aa]"
              />

            </a>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}


          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <LogOut
              size={18}
              strokeWidth={1.8}
            />

            {loggingOut
              ? "Logging Out..."
              : "Log Out"}

          </button>

        </div>

      </main>
    );
  }

  // ============================================================
  // LOGGED-OUT LOGIN PAGE
  // ============================================================

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f5f7fb] pb-24 px-4 py-8 text-[#172033] md:pb-0 md:px-6 md:py-12">

      <div className="mx-auto flex min-h-[82vh] max-w-md items-center justify-center">

        <div className="w-full rounded-[26px] border border-[#d7dfeb] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(20,35,55,0.08)] sm:px-8 sm:py-9">

          {/* TITLE */}

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f8]">
              <User
                size={26}
                strokeWidth={1.6}
              />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight">
              Account Login
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#5c6b82]">
              Access your Navira 3D order history and saved
              addresses.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}


          {/* GOOGLE */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={
              googleLoading || loading
            }
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#cbd6e5] bg-white text-sm font-semibold text-[#27344a] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <span className="text-lg font-bold text-[#4285F4]">
              G
            </span>

            {googleLoading
              ? "Connecting..."
              : "Continue with Google"}

          </button>

          <p className="mt-2 text-center text-xs leading-5 text-[#708099]">
            Instant 1-click passwordless access & verified
            account
          </p>


          {/* OR */}

          <div className="my-7 flex items-center gap-3">

            <div className="h-px flex-1 bg-[#dce3ed]" />

            <span className="text-xs font-semibold text-[#8b98aa]">
              OR
            </span>

            <div className="h-px flex-1 bg-[#dce3ed]" />

          </div>


          {/* EMAIL LOGIN TOGGLE */}

          <button
            type="button"
            onClick={() => {
              setShowEmailLogin(
                !showEmailLogin
              );
              setError("");
            }}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[#dce4ef] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#40506a] transition hover:bg-[#f1f5f9]"
          >

            <span>✉</span>

            <span>
              Sign in with Email & Password
            </span>

            <span
              className={`text-xs transition-transform ${
                showEmailLogin
                  ? "rotate-180"
                  : ""
              }`}
            >
              ⌄
            </span>

          </button>


          {/* EMAIL FORM */}

          {showEmailLogin && (
            <form
              onSubmit={handleEmailLogin}
              className="mt-5"
            >

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#40506a]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-[#cbd6e5] bg-white px-4 text-sm outline-none transition focus:border-[#172033]"
                />

              </div>


              <div className="mt-4">

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#40506a]"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-[#cbd6e5] bg-white px-4 text-sm outline-none transition focus:border-[#172033]"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="mt-5 h-12 w-full rounded-xl bg-[#172033] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>
          )}

        </div>

      </div>

    </main>
  );
}