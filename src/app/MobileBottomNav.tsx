"use client";

import Link from "next/link";
import {
  Headphones,
  ShoppingBag,
  User,
  Grid2X2,
  ArrowLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {!isHome && (
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="fixed bottom-[82px] left-4 z-[190] flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dee8] bg-white text-[#172033] shadow-[0_6px_20px_rgba(15,23,42,0.14)] md:hidden"
        >
          <ArrowLeft size={21} strokeWidth={2} />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-[200] border-t border-[#e3e8ef] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_25px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5">

          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 py-2 ${
              pathname === "/"
                ? "text-[#c8102e]"
                : "text-[#536277]"
            }`}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v11h14V9" />
              <path d="M9 20v-6h6v6" />
            </svg>

            <span className="text-[12px] font-semibold">
              Home
            </span>
          </Link>

          <Link
            href="/#shop"
            className={`flex flex-col items-center justify-center gap-1 py-2 ${
              pathname.startsWith("/product/")
                ? "text-[#c8102e]"
                : "text-[#536277]"
            }`}
          >
            <Grid2X2 size={25} strokeWidth={2} />

            <span className="text-[12px] font-semibold">
              Shop
            </span>
          </Link>

          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center gap-1 py-2 ${
              pathname === "/cart"
                ? "text-[#c8102e]"
                : "text-[#536277]"
            }`}
          >
            <ShoppingBag size={25} strokeWidth={2} />

            <span className="text-[12px] font-semibold">
              Cart
            </span>
          </Link>

          <a
            href="https://wa.me/918660215764"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-2 text-[#536277]"
          >
            <Headphones size={25} strokeWidth={2} />

            <span className="text-[12px] font-semibold">
              Support
            </span>
          </a>

          <Link
            href="/account"
            className={`flex flex-col items-center justify-center gap-1 py-2 ${
              pathname.startsWith("/account")
                ? "text-[#c8102e]"
                : "text-[#536277]"
            }`}
          >
            <User size={25} strokeWidth={2} />

            <span className="text-[12px] font-semibold">
              Account
            </span>
          </Link>

        </div>
      </nav>
    </>
  );
}