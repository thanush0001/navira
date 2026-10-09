"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SavedOrder = {
  orderNumber?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  total?: number;
};

export default function CheckoutSuccessPage() {
  const router = useRouter();

  const [order, setOrder] = useState<SavedOrder | null>(
    null
  );

  useEffect(() => {
    try {
      const savedOrder =
        localStorage.getItem("navira-last-order");

      if (!savedOrder) {
        return;
      }

      const parsedOrder = JSON.parse(savedOrder);

      setOrder(parsedOrder);
    } catch (error) {
      console.error(
        "Failed to read saved order:",
        error
      );
    }
  }, []);

  const orderNumber =
    order?.orderNumber ?? "—";

  const paymentMethod =
    order?.paymentMethod ?? "—";

  const paymentStatus =
    order?.paymentStatus ??
    (paymentMethod === "Cash on Delivery"
      ? "Pending"
      : "Paid");

  const total = Number(order?.total ?? 0);

  const isCOD =
    paymentMethod === "Cash on Delivery";

  return (
    <main className="min-h-screen bg-[#ffffff] px-6 py-16 text-[#171717]">
      <div className="mx-auto max-w-3xl overflow-hidden border border-black/10 bg-white">

        {/* HEADER */}
        <div className="border-b border-black/10 px-8 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-600"
            >
              <path
                d="M5 12l4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-4xl tracking-tight">
            Order Successful
          </h1>

          <p className="mt-4 text-[#625d57]">
            Thank you for shopping with NAVIRA 3D.
          </p>
        </div>

        {/* ORDER DETAILS */}
        <div className="p-8">
          <div className="bg-[#f7f8f9] p-6">

            <div className="flex justify-between gap-6">
              <span className="text-[#625d57]">
                Order Number
              </span>

              <span className="text-right font-medium">
                {orderNumber}
              </span>
            </div>

            <div className="mt-5 flex justify-between gap-6">
              <span className="text-[#625d57]">
                Payment Method
              </span>

              <span className="text-right">
                {paymentMethod}
              </span>
            </div>

            <div className="mt-5 flex justify-between gap-6">
              <span className="text-[#625d57]">
                Payment Status
              </span>

              <span
                className={
                  isCOD
                    ? "text-amber-600"
                    : "text-green-600"
                }
              >
                {paymentStatus}
              </span>
            </div>

            <div className="mt-6 border-t border-black/10 pt-6">
              <div className="flex justify-between">
                <span className="text-lg">
                  Total
                </span>

                <span className="text-lg font-medium">
                  ₹
                  {total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#625d57]">
            {isCOD
              ? "Your order has been received. Please pay when your order is delivered."
              : "Your payment has been successfully received. Your order is now being processed."}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-[#171717] px-8 py-4 text-sm text-white transition-opacity hover:opacity-80"
            >
              CONTINUE SHOPPING
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="border border-black px-8 py-4 text-sm transition-colors hover:bg-black hover:text-white"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}