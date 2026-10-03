"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        console.error(
          "SUPABASE LOGIN ERROR:",
          loginError
        );

        throw new Error(
          "Invalid email or password."
        );
      }

      // Login successful
      router.replace("/admin/orders");
      router.refresh();
    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-16 text-[#171717]">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full border border-black/10 bg-white p-8 md:p-10">

          {/* BRAND */}

          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="mt-4 text-4xl tracking-tight">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-[#625d57]">
            Sign in to manage orders.
          </p>

          {/* ERROR */}

          {error && (
            <div className="mt-7 border border-red-200 bg-red-50 px-4 py-4">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="mt-8"
          >

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-sm"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
                required
                className="h-16 w-full border border-black/20 bg-white px-4 text-base outline-none placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* PASSWORD */}

            <div className="mt-6">
              <label
                htmlFor="password"
                className="mb-3 block text-sm"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
                className="h-16 w-full border border-black/20 bg-white px-4 text-base outline-none placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-[#171717] px-8 py-5 text-[10px] font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "SIGNING IN..."
                : "SIGN IN"}
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}