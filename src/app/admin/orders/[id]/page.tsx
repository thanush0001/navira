"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  created_at: string;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;

  address?: string | null;
  shipping_address?: string | null;
  delivery_address?: string | null;

  [key: string]: unknown;
};

export default function AdminOrderDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [order, setOrder] = useState<Order | null>(
    null
  );

  const [orderItems, setOrderItems] = useState<
    OrderItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // LOAD ORDER
  // --------------------------------

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        throw new Error("Missing order ID");
      }

      const response = await fetch(
        `/api/orders/${encodeURIComponent(id)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.error ||
            "Failed to load order"
        );
      }

      // --------------------------------
      // SET ORDER
      // --------------------------------

      setOrder(result.order || null);

      // --------------------------------
      // SET ORDER ITEMS
      // --------------------------------

      if (Array.isArray(result.order_items)) {
        setOrderItems(result.order_items);
      } else {
        setOrderItems([]);
      }
    } catch (error) {
      console.error(
        "LOAD ORDER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

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

    return parsedDate.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // --------------------------------
  // FORMAT MONEY
  // --------------------------------

  const formatMoney = (value: number) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#171717] md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="mt-3 text-4xl tracking-tight">
            Order Details
          </h1>

          <div className="mt-8 border border-black/10 bg-white px-6 py-8">
            <p className="text-sm text-red-600">
              {error || "Order not found"}
            </p>

            <button
              type="button"
              onClick={loadOrder}
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
  // DELIVERY ADDRESS
  // --------------------------------

  const deliveryAddress =
    order.delivery_address ||
    order.shipping_address ||
    order.address ||
    null;

  // --------------------------------
  // ITEMS TOTAL
  // --------------------------------

  const itemsTotal = orderItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#171717] md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
              NAVIRA 3D
            </p>

            <h1 className="mt-3 text-4xl tracking-tight">
              Order Details
            </h1>

            <p className="mt-3 text-sm text-[#625d57]">
              {order.order_number}
            </p>
          </div>

          <div className="border border-black/10 bg-white px-6 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
              Status
            </p>

            <p className="mt-2 text-sm font-medium capitalize">
              {order.order_status || "placed"}
            </p>
          </div>
        </div>

        {/* CUSTOMER + PAYMENT */}

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* CUSTOMER */}

          <section className="border border-black/10 bg-white p-7">
            <p className="text-[10px] uppercase tracking-[0.2em]">
              Customer Information
            </p>

            <div className="mt-7 space-y-5">

              <div>
                <p className="text-xs text-[#756b60]">
                  Name
                </p>

                <p className="mt-1 text-sm">
                  {order.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#756b60]">
                  Phone
                </p>

                <p className="mt-1 text-sm">
                  {order.customer_phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#756b60]">
                  Email
                </p>

                <p className="mt-1 text-sm">
                  {order.customer_email}
                </p>
              </div>

            </div>
          </section>

          {/* PAYMENT */}

          <section className="border border-black/10 bg-white p-7">
            <p className="text-[10px] uppercase tracking-[0.2em]">
              Payment Information
            </p>

            <div className="mt-7 space-y-5">

              <div>
                <p className="text-xs text-[#756b60]">
                  Payment Method
                </p>

                <p className="mt-1 text-sm">
                  {order.payment_method}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#756b60]">
                  Payment Status
                </p>

                <p className="mt-1 text-sm capitalize">
                  {order.payment_status || "Pending"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#756b60]">
                  Order Date
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(order.created_at)}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* DELIVERY */}

        <section className="mt-6 border border-black/10 bg-white p-7">
          <p className="text-[10px] uppercase tracking-[0.2em]">
            Delivery Information
          </p>

          <div className="mt-7">
            {deliveryAddress ? (
              <p className="whitespace-pre-line text-sm leading-6">
                {String(deliveryAddress)}
              </p>
            ) : (
              <p className="text-sm">
                Address not available
              </p>
            )}
          </div>
        </section>

        {/* ORDER ITEMS */}

        <section className="mt-6 overflow-hidden border border-black/10 bg-white">

          <div className="border-b border-black/10 px-7 py-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em]">
                Order Items
              </p>

              <p className="text-xs text-[#756b60]">
                {orderItems.length}{" "}
                {orderItems.length === 1
                  ? "item"
                  : "items"}
              </p>
            </div>
          </div>

          {orderItems.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm">
                No order items found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] border-collapse">

                <thead>
                  <tr className="border-b border-black/10 text-left">

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Product
                    </th>

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Price
                    </th>

                    <th className="px-7 py-4 text-[10px] uppercase tracking-[0.15em]">
                      Quantity
                    </th>

                    <th className="px-7 py-4 text-right text-[10px] uppercase tracking-[0.15em]">
                      Subtotal
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {orderItems.map((item) => {
                    const subtotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-black/10 last:border-b-0"
                      >

                        {/* PRODUCT */}

                        <td className="px-7 py-5">

                          <div className="flex items-center gap-4">

                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={
                                  item.product_name ||
                                  item.product_id
                                }
                                className="h-16 w-16 border border-black/10 object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-black/10 bg-[#f7f5f0] text-[9px] uppercase tracking-wider text-[#756b60]">
                                No Image
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-medium">
                                {item.product_name ||
                                  item.product_id}
                              </p>

                              <p className="mt-1 text-xs text-[#756b60]">
                                {item.product_id}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* PRICE */}

                        <td className="px-7 py-5">
                          <p className="text-sm">
                            {formatMoney(
                              Number(item.price)
                            )}
                          </p>
                        </td>

                        {/* QUANTITY */}

                        <td className="px-7 py-5">
                          <p className="text-sm">
                            {item.quantity}
                          </p>
                        </td>

                        {/* SUBTOTAL */}

                        <td className="px-7 py-5 text-right">
                          <p className="text-sm font-medium">
                            {formatMoney(subtotal)}
                          </p>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* TOTAL */}

        <section className="mt-6 border border-black/10 bg-white p-7">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-lg">
                Order Total
              </p>

              {orderItems.length > 0 && (
                <p className="mt-1 text-xs text-[#756b60]">
                  {orderItems.length}{" "}
                  {orderItems.length === 1
                    ? "item"
                    : "items"}
                </p>
              )}
            </div>

            <p className="text-2xl font-medium">
              {formatMoney(
                Number(order.total)
              )}
            </p>

          </div>

          {orderItems.length > 0 &&
            itemsTotal !== Number(order.total) && (
              <p className="mt-4 text-xs text-[#756b60]">
                Items subtotal:{" "}
                {formatMoney(itemsTotal)}
              </p>
            )}

        </section>

      </div>
    </main>
  );
}