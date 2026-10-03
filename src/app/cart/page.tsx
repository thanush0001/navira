"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f5f0] pb-24 text-[#171717] md:pb-0">

      {/* =====================================================
          CART HEADER
      ===================================================== */}
      <section className="w-full px-4 pb-8 pt-8 sm:px-6 md:mx-auto md:max-w-6xl md:px-10 md:py-20">

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
          NAVIRA 3D
        </p>

        <h1 className="mt-3 text-3xl tracking-tight md:mt-4 md:text-4xl">
          Your Cart
        </h1>

        <div className="mt-8 border-t border-black/10 md:mt-12" />

      </section>


      {/* =====================================================
          EMPTY CART
      ===================================================== */}
      {cart.length === 0 ? (

        <section className="w-full px-5 pb-24 md:mx-auto md:max-w-6xl md:px-10">

          <div className="flex min-h-[430px] flex-col items-center justify-center px-4 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-3xl">
                🛒
              </span>
            </div>

            <h2 className="mt-7 text-xl font-medium">
              Your cart is empty.
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#625d57]">
              Add something from the Navira collection
              to get started.
            </p>

            <Link
              href="/"
              className="mt-8 rounded-full bg-[#171717] px-8 py-4 text-[10px] font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-80"
            >
              CONTINUE SHOPPING
            </Link>

          </div>

        </section>

      ) : (

        /* =====================================================
           CART CONTENT
        ===================================================== */
        <section className="w-full px-4 pb-10 sm:px-6 md:mx-auto md:max-w-6xl md:px-10 md:pb-20">

          <div className="grid gap-8 lg:grid-cols-[1fr_350px] lg:gap-12">

            {/* =================================================
                CART ITEMS
            ================================================= */}
            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 md:rounded-none md:border-x-0 md:border-t-0 md:bg-transparent md:p-0 md:pb-6"
                >

                  <div className="flex gap-4 sm:gap-6">

                    {/* PRODUCT IMAGE */}
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f7f7f7] sm:h-32 sm:w-28 md:rounded-none">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2.5 sm:p-3"
                      />

                    </div>


                    {/* PRODUCT DETAILS */}
                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h2 className="truncate text-base font-medium sm:text-lg">
                            {item.name}
                          </h2>

                          <p className="mt-1.5 text-sm text-[#625d57]">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>

                        </div>

                        <p className="shrink-0 text-sm font-medium">
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>


                      {/* QUANTITY + REMOVE */}
                      <div className="mt-5 flex items-center justify-between gap-3">

                        {/* QUANTITY */}
                        <div className="flex h-10 w-[112px] items-center justify-between rounded-full border border-black/15 bg-[#f7f7f7] px-4">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center text-lg text-[#625d57] transition hover:text-black"
                          >
                            −
                          </button>

                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center text-lg text-[#625d57] transition hover:text-black"
                          >
                            +
                          </button>

                        </div>


                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="text-[10px] uppercase tracking-[0.15em] text-[#756b60] underline underline-offset-4 transition hover:text-red-600"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* =================================================
                ORDER SUMMARY
            ================================================= */}
            <div className="h-fit rounded-2xl border border-black/10 bg-white p-5 sm:p-7 lg:rounded-none">

              <p className="text-[10px] uppercase tracking-[0.2em]">
                Order Summary
              </p>

              <div className="mt-6 flex justify-between text-sm">

                <span className="text-[#625d57]">
                  Subtotal
                </span>

                <span>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>

              </div>

              <div className="mt-4 flex items-start justify-between gap-4 text-sm">

                <span className="text-[#625d57]">
                  Shipping
                </span>

                <span className="text-right text-xs text-[#625d57]">
                  Calculated at checkout
                </span>

              </div>

              <div className="my-6 border-t border-black/10" />

              <div className="flex justify-between">

                <span className="text-sm">
                  Total
                </span>

                <span className="text-lg font-medium">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>

              </div>


              {/* CHECKOUT */}
              <button
                type="button"
                onClick={() =>
                  router.push("/checkout")
                }
                className="mt-7 w-full rounded-full bg-[#c8102e] px-8 py-4 text-[11px] font-bold tracking-[0.15em] text-white transition-opacity hover:opacity-90"
              >
                PROCEED TO CHECKOUT
              </button>


              {/* CONTINUE SHOPPING */}
              <Link
                href="/"
                className="mt-5 block text-center text-[10px] uppercase tracking-[0.15em] underline underline-offset-4"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}