"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

const statuses = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // LOAD ORDERS
  // --------------------------------

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/orders", {
        method: "GET",
        cache: "no-store",
      });

      let result: any;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          `Orders API returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result?.error || "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(result.orders)
          ? result.orders
          : []
      );
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // --------------------------------
  // STATISTICS
  // --------------------------------

  const statistics = useMemo(() => {
    const totalOrders = orders.length;

    const processingOrders = orders.filter(
      (order) =>
        order.order_status === "processing"
    ).length;

    const deliveredOrders = orders.filter(
      (order) =>
        order.order_status === "delivered"
    ).length;

    const cancelledOrders = orders.filter(
      (order) =>
        order.order_status === "cancelled"
    ).length;

    const pendingOrders = orders.filter(
      (order) =>
        order.order_status === "placed" ||
        order.order_status === "confirmed"
    ).length;

    const totalSales = orders
      .filter(
        (order) =>
          order.order_status !== "cancelled"
      )
      .reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

    return {
      totalOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      pendingOrders,
      totalSales,
    };
  }, [orders]);

  // --------------------------------
  // RECENT ORDERS
  // --------------------------------

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  // --------------------------------
  // FORMAT MONEY
  // --------------------------------

  const formatMoney = (value: number) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // --------------------------------
  // FORMAT DATE
  // --------------------------------

  const formatDate = (date: string) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // --------------------------------
  // FORMAT STATUS
  // --------------------------------

  const formatStatus = (status: string) => {
    if (!status) {
      return "Placed";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#ffffff] px-6 py-12 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="mt-3 text-4xl tracking-tight">
            Admin Dashboard
          </h1>

          <p className="mt-8 text-sm text-[#625d57]">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-[#ffffff] px-6 py-12 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="mt-3 text-4xl tracking-tight">
            Admin Dashboard
          </h1>

          <div className="mt-8 border border-black/10 bg-white p-7">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-5 border border-black/20 bg-white px-6 py-3 text-[10px] font-medium tracking-[0.2em] hover:border-black"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------
  // DASHBOARD
  // --------------------------------

  return (
    <main className="min-h-screen bg-[#ffffff] px-6 py-12 text-[#171717] md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
              NAVIRA 3D
            </p>

            <h1 className="mt-3 text-4xl tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-sm text-[#625d57]">
              Overview of your store orders and sales.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadOrders}
              className="border border-black/20 bg-white px-6 py-3 text-[10px] font-medium tracking-[0.2em] transition-colors hover:border-black"
            >
              REFRESH
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/orders")
              }
              className="bg-[#171717] px-6 py-3 text-[10px] font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-80"
            >
              VIEW ORDERS
            </button>
          </div>
        </div>

        {/* STAT CARDS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL ORDERS */}

          <div className="border border-black/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Total Orders
            </p>

            <p className="mt-5 text-3xl tracking-tight">
              {statistics.totalOrders}
            </p>

            <p className="mt-2 text-xs text-[#625d57]">
              All orders
            </p>
          </div>

          {/* PROCESSING */}

          <div className="border border-black/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Processing
            </p>

            <p className="mt-5 text-3xl tracking-tight">
              {statistics.processingOrders}
            </p>

            <p className="mt-2 text-xs text-[#625d57]">
              Currently processing
            </p>
          </div>

          {/* DELIVERED */}

          <div className="border border-black/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Delivered
            </p>

            <p className="mt-5 text-3xl tracking-tight">
              {statistics.deliveredOrders}
            </p>

            <p className="mt-2 text-xs text-[#625d57]">
              Successfully delivered
            </p>
          </div>

          {/* CANCELLED */}

          <div className="border border-black/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Cancelled
            </p>

            <p className="mt-5 text-3xl tracking-tight">
              {statistics.cancelledOrders}
            </p>

            <p className="mt-2 text-xs text-[#625d57]">
              Cancelled orders
            </p>
          </div>

        </div>

        {/* SALES + PENDING */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">

          {/* TOTAL SALES */}

          <section className="border border-black/10 bg-white p-7">

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Total Sales
            </p>

            <p className="mt-5 text-4xl tracking-tight">
              {formatMoney(
                statistics.totalSales
              )}
            </p>

            <p className="mt-3 text-sm text-[#625d57]">
              Based on all non-cancelled orders.
            </p>

          </section>

          {/* PENDING */}

          <section className="border border-black/10 bg-white p-7">

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Pending Orders
            </p>

            <p className="mt-5 text-4xl tracking-tight">
              {statistics.pendingOrders}
            </p>

            <p className="mt-3 text-sm text-[#625d57]">
              Placed or confirmed orders.
            </p>

          </section>

        </div>

        {/* RECENT ORDERS */}

        <section className="mt-6 overflow-hidden border border-black/10 bg-white">

          <div className="flex flex-col gap-4 border-b border-black/10 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em]">
                Recent Orders
              </p>

              <p className="mt-2 text-sm text-[#625d57]">
                Latest customer orders.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/orders")
              }
              className="border border-black/20 bg-white px-5 py-3 text-[10px] font-medium tracking-[0.2em] hover:border-black"
            >
              ALL ORDERS
            </button>

          </div>

          {recentOrders.length === 0 ? (

            <div className="px-7 py-16 text-center">

              <p className="text-lg">
                No orders yet.
              </p>

              <p className="mt-2 text-sm text-[#625d57]">
                Orders created through checkout will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] border-collapse">

                <thead>

                  <tr className="border-b border-black/10 text-left">

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Order
                    </th>

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Customer
                    </th>

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Total
                    </th>

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Status
                    </th>

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b border-black/10 last:border-b-0"
                    >

                      <td className="px-7 py-5">
                        <p className="text-sm font-medium">
                          {order.order_number || "—"}
                        </p>
                      </td>

                      <td className="px-7 py-5">
                        <p className="text-sm">
                          {order.customer_name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-[#625d57]">
                          {order.customer_phone || "—"}
                        </p>
                      </td>

                      <td className="px-7 py-5">
                        <p className="text-sm font-medium">
                          {formatMoney(
                            Number(order.total || 0)
                          )}
                        </p>
                      </td>

                      <td className="px-7 py-5">
                        <span className="inline-flex border border-black/15 px-3 py-2 text-xs">
                          {formatStatus(
                            order.order_status
                          )}
                        </span>
                      </td>

                      <td className="px-7 py-5">
                        <p className="text-xs text-[#625d57]">
                          {formatDate(
                            order.created_at
                          )}
                        </p>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* QUICK ACTIONS */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() =>
              router.push("/admin/orders")
            }
            className="border border-black/10 bg-white p-7 text-left transition-colors hover:border-black/30"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Manage
            </p>

            <p className="mt-3 text-xl">
              Orders
            </p>

            <p className="mt-2 text-sm text-[#625d57]">
              View orders, customers and update delivery status.
            </p>

            <p className="mt-5 text-[10px] font-medium tracking-[0.2em]">
              OPEN ORDERS →
            </p>
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="border border-black/10 bg-white p-7 text-left transition-colors hover:border-black/30"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Store
            </p>

            <p className="mt-3 text-xl">
              View Website
            </p>

            <p className="mt-2 text-sm text-[#625d57]">
              Open the customer-facing NAVIRA 3D store.
            </p>

            <p className="mt-5 text-[10px] font-medium tracking-[0.2em]">
              OPEN STORE →
            </p>
          </button>

        </section>

      </div>
    </main>
  );
}