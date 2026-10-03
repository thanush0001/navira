"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --------------------------------
  // LOAD ORDERS
  // --------------------------------

  const loadOrders = async () => {
    try {
      setLoading(true);

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

      setOrders(result.orders || []);
    } catch (error) {
      console.error("LOAD ORDERS ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load orders."
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
  // UPDATE STATUS
  // --------------------------------

  const updateOrderStatus = async (
    orderId: string,
    orderStatus: string
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch("/api/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderStatus,
        }),
      });

      let result: any;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          `Status API returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result?.error || "Failed to update order status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                order_status: orderStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
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
  // FORMAT PAYMENT
  // --------------------------------

  const formatPaymentMethod = (
    paymentMethod: string
  ) => {
    if (!paymentMethod) {
      return "—";
    }

    return paymentMethod;
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
      <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="mt-3 text-4xl tracking-tight">
            Orders
          </h1>

          <p className="mt-8 text-sm text-[#625d57]">
            Loading orders...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#171717] md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
              NAVIRA 3D
            </p>

            <h1 className="mt-3 text-4xl tracking-tight">
              Orders
            </h1>

            <p className="mt-3 text-sm text-[#625d57]">
              Manage customer orders and delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="border border-black/20 bg-white px-6 py-3 text-[10px] font-medium tracking-[0.2em] transition-colors hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            REFRESH ORDERS
          </button>
        </div>

        {/* ORDER COUNT */}

        <div className="mt-8">
          <p className="text-sm text-[#625d57]">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        {/* ORDERS */}

        <div className="mt-6 overflow-hidden border border-black/10 bg-white">

          {orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg">
                No orders found.
              </p>

              <p className="mt-2 text-sm text-[#625d57]">
                Orders created from checkout will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px] border-collapse">

                <thead>
                  <tr className="border-b border-black/10 text-left">

                    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Order
                    </th>

                    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Total
                    </th>

                    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] uppercase tracking-[0.15em]">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b border-black/10 last:border-b-0"
                    >

                      {/* ORDER */}

                      <td className="px-5 py-5">

                        <Link
                          href={`/admin/orders/${encodeURIComponent(
                            order.order_number
                          )}`}
                          className="group block"
                        >

                          <p className="text-sm font-medium transition-colors group-hover:underline">
                            {order.order_number || "—"}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-[#756b60]">
                            {order.id}
                          </p>

                        </Link>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-5">

                        <p className="text-sm">
                          {order.customer_name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-[#625d57]">
                          {order.customer_phone || "—"}
                        </p>

                        <p className="mt-1 text-xs text-[#625d57]">
                          {order.customer_email || "—"}
                        </p>

                      </td>

                      {/* PAYMENT */}

                      <td className="px-5 py-5">

                        <p className="text-sm">
                          {formatPaymentMethod(
                            order.payment_method
                          )}
                        </p>

                      </td>

                      {/* TOTAL */}

                      <td className="px-5 py-5">

                        <p className="text-sm font-medium">
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-5">

                        <p className="text-xs text-[#625d57]">
                          {formatDate(
                            order.created_at
                          )}
                        </p>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-5">

                        <select
                          value={
                            order.order_status ||
                            "placed"
                          }
                          disabled={
                            updatingId === order.id
                          }
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value
                            )
                          }
                          className="min-w-[150px] border border-black/20 bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {statuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(status)}
                            </option>
                          ))}

                        </select>

                        {updatingId === order.id && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#756b60]">
                            Updating...
                          </p>
                        )}

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-5 text-right">

                        <Link
                          href={`/admin/orders/${encodeURIComponent(
                            order.order_number
                          )}`}
                          className="inline-block border border-black/20 bg-white px-5 py-3 text-[10px] font-medium tracking-[0.18em] transition-colors hover:border-black hover:bg-[#f7f5f0]"
                        >
                          VIEW ORDER
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}