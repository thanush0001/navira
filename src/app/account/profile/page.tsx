"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

type Address = {
  id: string;
  full_name: string;
  mobile_number: string;
  address_line1: string;
  address_line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
};

export default function CustomerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  const [addressError, setAddressError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "Karnataka",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const supabase = createClient();

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        setForm((current) => ({
          ...current,
          fullName,
        }));
      }

      setLoadingUser(false);
    };

    loadUser();
  }, []);

  // =========================================================
  // LOAD CUSTOMER ORDERS
  // =========================================================

  useEffect(() => {
    if (!user?.id && !user?.email) {
      setOrdersLoading(false);
      return;
    }

    const loadOrders = async () => {
      setOrdersLoading(true);

      try {
        const response = await fetch("/api/account/orders", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Unable to load orders."
          );
        }

        setOrders(data?.orders || []);
      } catch (error) {
        console.error("CUSTOMER ORDERS ERROR:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  // =========================================================
  // LOAD CUSTOMER ADDRESSES
  // =========================================================

  useEffect(() => {
    if (!user) {
      setAddressesLoading(false);
      return;
    }

    const loadAddresses = async () => {
      setAddressesLoading(true);

      try {
        const response = await fetch(
          "/api/account/addresses",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Unable to load addresses."
          );
        }

        setAddresses(data?.addresses || []);
      } catch (error) {
        console.error(
          "CUSTOMER ADDRESSES ERROR:",
          error
        );

        setAddresses([]);
      } finally {
        setAddressesLoading(false);
      }
    };

    loadAddresses();
  }, [user]);

  // =========================================================
  // SAVE ADDRESS
  // =========================================================

  const handleSaveAddress = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (savingAddress) return;

    setSavingAddress(true);
    setAddressMessage("");
    setAddressError("");

    try {
      const response = await fetch(
        "/api/account/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save address."
        );
      }

      setAddresses((current) => [
        ...(data.address ? [data.address] : []),
        ...current.filter(
          (address) =>
            address.id !== data?.address?.id
        ),
      ]);

      setAddressMessage("Address saved successfully.");

      setForm((current) => ({
        ...current,
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        postalCode: "",
        isDefault: false,
      }));
    } catch (error) {
      console.error("SAVE ADDRESS ERROR:", error);

      setAddressError(
        error instanceof Error
          ? error.message
          : "Unable to save address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // =========================================================
  // DISPLAY NAME
  // =========================================================

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "NAVIRA Customer";

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!loadingUser && !user) {
    return (
      <main className="min-h-screen bg-[#f4f6fb] px-5 py-12">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-[#dbe2ec] bg-white p-10 text-center shadow-[0_20px_60px_rgba(20,35,55,0.08)]">
            <User
              size={44}
              strokeWidth={1.2}
              className="mx-auto mb-5 text-[#8795aa]"
            />

            <h1 className="text-2xl font-semibold text-[#172033]">
              Sign in to your account
            </h1>

            <p className="mt-3 text-sm text-[#68778d]">
              Please sign in to view your orders,
              profile and saved delivery addresses.
            </p>

            <Link
              href="/account"
              className="mt-7 inline-block rounded-full bg-[#172033] px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              GO TO LOGIN
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f1f6] via-[#f4f6fb] to-[#eef5ff] px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-[1300px]">

        {/* =====================================================
            TOP PROFILE CARD
        ===================================================== */}

        <section className="rounded-[26px] border border-[#dce3ed] bg-white px-7 py-8 shadow-[0_18px_50px_rgba(20,35,55,0.08)] md:px-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-red-600">
                CUSTOMER PROFILE
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#172033] md:text-4xl">
                {displayName}
              </h1>

              <p className="mt-1 text-sm text-[#65748a]">
                {user?.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/918660215764"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#cbd6e5] bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition hover:bg-[#f7f9fc]"
              >
                <Headphones size={16} />
                My Support Tickets
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[#172033] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Logout
              </button>
            </div>

          </div>
        </section>

        {/* =====================================================
            GOOGLE CONNECTION
        ===================================================== */}

        <section className="mt-8 rounded-[26px] border border-emerald-200 bg-emerald-50/70 px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white">
                <ShieldCheck
                  size={21}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-[#172033]">
                    Google Account Connected
                  </h2>

                  <span className="rounded-full bg-emerald-200 px-3 py-1 text-[10px] font-bold tracking-wide text-emerald-800">
                    ACTIVE
                  </span>
                </div>

                <p className="text-sm text-[#65748a]">
                  Linked as {user?.email}. You can sign in
                  with 1-click Google OAuth.
                </p>
              </div>
            </div>

            <div className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-xs font-semibold text-emerald-700">
              🔒 Protected by Google
            </div>

          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_410px]">

          {/* ===================================================
              ORDERS
          =================================================== */}

          <section id="orders">
            <div className="flex items-center justify-between border-b border-[#dce3ed] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#172033]">
                  My Order History
                </h2>

                <p className="mt-1 text-sm text-[#728097]">
                  Your personal orders and delivery status.
                </p>
              </div>

              <Package
                size={25}
                strokeWidth={1.4}
                className="text-[#8b99ad]"
              />
            </div>

            <div className="mt-5">
              {ordersLoading ? (
                <div className="rounded-[24px] border border-[#dce3ed] bg-white p-12 text-center">
                  <p className="text-sm text-[#68778d]">
                    Loading your orders...
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-[24px] border border-[#dce3ed] bg-white p-12 text-center shadow-[0_15px_40px_rgba(20,35,55,0.05)]">
                  <Package
                    size={48}
                    strokeWidth={1.2}
                    className="mx-auto text-[#9aa9bc]"
                  />

                  <h3 className="mt-4 text-lg font-semibold text-[#172033]">
                    No Orders Placed Yet
                  </h3>

                  <p className="mt-2 text-sm text-[#728097]">
                    Your order history will appear here
                    once you place an order.
                  </p>

                  <Link
                    href="/#shop"
                    className="mt-6 inline-block rounded-full bg-red-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[22px] border border-[#dce3ed] bg-white p-5 shadow-[0_12px_35px_rgba(20,35,55,0.05)]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                          <p className="text-xs font-semibold tracking-[0.12em] text-[#78869a]">
                            ORDER
                          </p>

                          <p className="mt-1 font-semibold text-[#172033]">
                            {order.order_number}
                          </p>

                          <p className="mt-1 text-xs text-[#7a8799]">
                            {new Date(
                              order.created_at
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-lg font-semibold text-[#172033]">
                            ₹
                            {Number(
                              order.total || 0
                            ).toLocaleString("en-IN")}
                          </p>

                          <span className="mt-1 inline-block rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold capitalize text-[#45546a]">
                            {order.order_status}
                          </span>
                        </div>

                      </div>

                      <div className="mt-4 border-t border-[#edf0f4] pt-4">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#68778d]">
                          <span>
                            Payment:{" "}
                            <strong className="text-[#40506a]">
                              {order.payment_method}
                            </strong>
                          </span>

                          <span>
                            Phone:{" "}
                            <strong className="text-[#40506a]">
                              {order.customer_phone}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
              DELIVERY ADDRESSES
          =================================================== */}

          <section>
            <div className="rounded-[26px] border border-[#dce3ed] bg-white p-6 shadow-[0_15px_40px_rgba(20,35,55,0.06)]">

              <div className="flex items-center justify-between border-b border-[#dce3ed] pb-4">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={20}
                    className="text-[#172033]"
                  />

                  <h2 className="text-xl font-bold text-[#172033]">
                    Delivery Addresses
                  </h2>
                </div>

                <span className="text-xs text-[#7a8799]">
                  {addresses.length} saved
                </span>
              </div>

              {/* SAVED ADDRESSES */}

              <div className="mt-5 space-y-3">
                {addressesLoading ? (
                  <p className="text-sm text-[#728097]">
                    Loading addresses...
                  </p>
                ) : addresses.length === 0 ? (
                  <p className="text-sm italic leading-6 text-[#728097]">
                    No delivery addresses saved yet.
                    Add your first courier address below.
                  </p>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-2xl border border-[#dce3ed] bg-[#f8fafc] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#172033]">
                            {address.full_name}
                          </p>

                          <p className="mt-1 text-xs text-[#68778d]">
                            {address.mobile_number}
                          </p>

                          <p className="mt-3 text-sm leading-6 text-[#52627a]">
                            {address.address_line1}
                            {address.address_line2
                              ? `, ${address.address_line2}`
                              : ""}
                            {address.landmark
                              ? `, ${address.landmark}`
                              : ""}
                            <br />
                            {address.city},{" "}
                            {address.state}{" "}
                            {address.postal_code}
                            <br />
                            {address.country}
                          </p>
                        </div>

                        {address.is_default && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-700">
                            DEFAULT
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* ADD ADDRESS */}

              <div className="mt-6 border-t border-[#dce3ed] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#40506a]">
                  Add New Address
                </h3>

                {addressMessage && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {addressMessage}
                  </div>
                )}

                {addressError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {addressError}
                  </div>
                )}

                <form
                  onSubmit={handleSaveAddress}
                  className="mt-4 space-y-3"
                >
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Full Name *"
                    className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                  />

                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.mobileNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mobileNumber:
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                      })
                    }
                    placeholder="Mobile Number (10 digits) *"
                    className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                  />

                  <input
                    type="text"
                    required
                    value={form.addressLine1}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        addressLine1:
                          e.target.value,
                      })
                    }
                    placeholder="Flat/House, Building, Street *"
                    className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                  />

                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        landmark: e.target.value,
                      })
                    }
                    placeholder="Landmark / Area (Optional)"
                    className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          city: e.target.value,
                        })
                      }
                      placeholder="City *"
                      className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                    />

                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          state: e.target.value,
                        })
                      }
                      placeholder="State"
                      className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={form.postalCode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          postalCode:
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6),
                        })
                      }
                      placeholder="Postal Pincode *"
                      className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                    />

                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          country: e.target.value,
                        })
                      }
                      placeholder="Country"
                      className="h-11 w-full rounded-full border border-[#cbd6e5] bg-white px-4 text-sm outline-none focus:border-[#172033]"
                    />
                  </div>

                  <label className="flex items-center gap-2 py-1 text-xs text-[#52627a]">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          isDefault:
                            e.target.checked,
                        })
                      }
                    />

                    Set as default address
                  </label>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="h-11 w-full rounded-full bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingAddress
                      ? "Saving Address..."
                      : "Save Address"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            BACK TO SHOP
        ===================================================== */}

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#40506a] transition hover:text-[#172033]"
          >
            <ArrowLeft size={16} />
            Back to Navira
          </Link>
        </div>
      </div>
    </main>
  );
}