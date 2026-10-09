"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
} from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total: number;
  payment_method: string;
  order_status: string;
  created_at: string;
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/account/orders",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Unable to load your orders."
          );
        }

        setOrders(result.orders ?? []);
      } catch (error) {
        console.error(
          "CUSTOMER ORDERS PAGE ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatPrice = (value: number) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const statusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "shipped":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "processing":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "confirmed":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <main
      className="
        min-h-[100dvh]
        w-full
        overflow-x-hidden
        bg-[#ffffff]
        text-[#172033]
      "
      style={{
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* HEADER */}
      <header className="border-b border-black/10 bg-white">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1100px]
            items-center
            justify-between
            px-4
            py-4
            md:px-6
            md:py-5
          "
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.18em]"
          >
            NAVIRA 3D
          </Link>

          <Link
            href="/account"
            className="
              rounded-full
              bg-[#f1f3f6]
              px-4
              py-2
              text-xs
              font-semibold
              text-[#172033]
            "
          >
            My Account
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <section
        className="
          w-full
          px-4
          pb-40
          pt-7
          md:px-6
          md:pb-20
          md:pt-12
        "
      >
        <div className="mx-auto w-full max-w-[1100px]">
          {/* BACK */}
          <Link
            href="/account"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#d8dee8]
              bg-white
              px-4
              py-2.5
              text-xs
              font-semibold
              text-[#52627a]
              shadow-sm
            "
          >
            <ArrowLeft size={15} />
            Back to Account
          </Link>

          {/* TITLE */}
          <div className="mt-7">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-[#6b7890]">
              CUSTOMER ACCOUNT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-[600px] text-sm leading-6 text-[#6b7890]">
              View your Navira 3D purchases and order status.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mt-8 rounded-3xl border border-[#e1e5eb] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f3f6]">
                <Package
                  size={22}
                  className="animate-pulse text-[#52627a]"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-[#52627a]">
                Loading your orders...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-semibold text-red-700">
                Unable to load orders
              </p>

              <p className="mt-2 text-sm leading-6 text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && orders.length === 0 && (
            <div className="mt-8 rounded-3xl border border-[#e1e5eb] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f3f6]">
                <ShoppingBag
                  size={25}
                  className="text-[#52627a]"
                />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-[#6b7890]">
                Your Navira purchases will appear here after
                you place an order.
              </p>

              <Link
                href="/#shop"
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-[#c8102e]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                "
              >
                Start Shopping
              </Link>
            </div>
          )}

          {/* ORDERS */}
          {!loading && !error && orders.length > 0 && (
            <div className="mt-8 space-y-5">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="
                    w-full
                    rounded-3xl
                    border
                    border-[#e1e5eb]
                    bg-white
                    p-5
                    shadow-sm
                    md:p-6
                  "
                >
                  {/* ORDER TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7a8799]">
                        ORDER
                      </p>

                      <h2 className="mt-1 break-all text-base font-semibold">
                        {order.order_number}
                      </h2>
                    </div>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        border
                        px-3
                        py-1.5
                        text-[11px]
                        font-semibold
                        capitalize
                        ${statusClass(order.order_status)}
                      `}
                    >
                      {order.order_status}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="mt-5 rounded-2xl bg-[#ffffff] p-4">
                    <p className="text-xs font-medium text-[#6b7890]">
                      Placed on
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#172033]">
                      {formatDate(order.created_at)}
                    </p>

                    <p className="mt-0.5 text-xs text-[#6b7890]">
                      {formatTime(order.created_at)}
                    </p>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#e8ebef] p-4">
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-[#7a8799]">
                        PAYMENT
                      </p>

                      <p className="mt-1 text-sm font-semibold capitalize">
                        {order.payment_method}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#e8ebef] p-4">
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-[#7a8799]">
                        TOTAL
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div className="mt-4 border-t border-[#edf0f3] pt-4">
                    <p className="text-[10px] font-semibold tracking-[0.15em] text-[#7a8799]">
                      CUSTOMER
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {order.customer_name}
                    </p>

                    <p className="mt-1 break-all text-xs text-[#6b7890]">
                      {order.customer_email}
                    </p>

                    <p className="mt-1 text-xs text-[#6b7890]">
                      {order.customer_phone}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* EXTRA MOBILE SPACE */}
          <div className="h-20 md:hidden" />
        </div>
      </section>
    </main>
  );
}