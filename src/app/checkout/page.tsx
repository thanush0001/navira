"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = "cod" | "upi";

type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, cartTotal, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // ============================================================
  // LOAD RAZORPAY CHECKOUT
  // ============================================================

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const existingScript =
      document.getElementById("razorpay-checkout");

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        setRazorpayLoaded(true);
      });

      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-checkout";
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay Checkout loaded");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout");
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  // ============================================================
  // VALIDATE CUSTOMER DETAILS
  // ============================================================

  const validateCustomerDetails = (): Customer | null => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();
    const cleanState = state.trim();
    const cleanPincode = pincode.trim();

    if (
      !cleanName ||
      !cleanPhone ||
      !cleanEmail ||
      !cleanAddress ||
      !cleanCity ||
      !cleanState ||
      !cleanPincode
    ) {
      alert("Please fill in all delivery details.");
      return null;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return null;
    }

    if (!/^\d{6}$/.test(cleanPincode)) {
      alert("Please enter a valid 6-digit PIN code.");
      return null;
    }

    return {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      address: cleanAddress,
      city: cleanCity,
      state: cleanState,
      pincode: cleanPincode,
    };
  };

  // ============================================================
  // SAVE LAST ORDER
  // ============================================================

  const saveLastOrder = (order: Record<string, any>) => {
    try {
      localStorage.setItem(
        "navira-last-order",
        JSON.stringify(order)
      );
    } catch (error) {
      console.error(
        "Failed to save order to localStorage:",
        error
      );
    }
  };

  // ============================================================
  // CASH ON DELIVERY
  // ============================================================

  const placeCashOnDeliveryOrder = async (
    customer: Customer,
    orderNumber: string
  ) => {
    const orderTotal = Number(cartTotal);

    const order = {
      orderNumber,
      customer,
      items: cart,
      total: orderTotal,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,
    };

    console.log("Creating COD order:", order);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    let result: any;

    try {
      result = await response.json();
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }

    console.log("COD order response:", result);

    if (!response.ok || !result.success) {
      throw new Error(
        result?.error ||
          "Could not place your Cash on Delivery order."
      );
    }

    const savedOrder = {
      orderNumber,
      customer,
      items: cart,
      total: orderTotal,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      databaseOrder: result.order ?? null,
    };

    saveLastOrder(savedOrder);

    clearCart();

    router.push("/checkout/success");
  };

  // ============================================================
  // RAZORPAY PAYMENT
  // ============================================================

  const startRazorpayPayment = async (
    customer: Customer,
    orderNumber: string
  ) => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert(
        "Payment gateway is still loading. Please try again."
      );

      setIsSubmitting(false);

      return;
    }

    const orderTotal = Number(cartTotal);

    // ----------------------------------------------------------
    // CREATE RAZORPAY ORDER
    // ----------------------------------------------------------

    const createResponse = await fetch(
      "/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: orderTotal,
          receipt: orderNumber,
        }),
      }
    );

    let createResult: any;

    try {
      createResult = await createResponse.json();
    } catch {
      throw new Error(
        "Invalid response from payment server."
      );
    }

    console.log(
      "Razorpay create-order response:",
      createResult
    );

    if (!createResponse.ok || !createResult.success) {
      throw new Error(
        createResult?.error ||
          "Could not create payment order."
      );
    }

    const razorpayOrder = createResult.order;

    if (!razorpayOrder?.id) {
      throw new Error(
        "Razorpay order ID was not returned by the server."
      );
    }

    if (!createResult.keyId) {
      throw new Error(
        "Razorpay Key ID was not returned by the server."
      );
    }

    // ----------------------------------------------------------
    // RAZORPAY CHECKOUT OPTIONS
    // ----------------------------------------------------------

    const options = {
      key: createResult.keyId,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      name: "NAVIRA 3D",

      description: `NAVIRA 3D Order ${orderNumber}`,

      order_id: razorpayOrder.id,

      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },

      notes: {
        order_number: orderNumber,
      },

      theme: {
        color: "#c8102e",
      },

      method: {
        upi: true,
      },

      handler: async function (response: any) {
        try {
          console.log(
            "Razorpay payment response:",
            response
          );

          // ----------------------------------------------------
          // VERIFY PAYMENT ON SERVER
          // ----------------------------------------------------

          const verifyResponse = await fetch(
            "/api/payment/verify",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                orderNumber,

                customer,

                items: cart,

                total: orderTotal,

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }),
            }
          );

          let verifyResult: any;

          try {
            verifyResult =
              await verifyResponse.json();
          } catch {
            throw new Error(
              "Invalid payment verification response."
            );
          }

          console.log(
            "Payment verification response:",
            verifyResult
          );

          if (
            !verifyResponse.ok ||
            !verifyResult.success
          ) {
            throw new Error(
              verifyResult?.error ||
                "Payment verification failed."
            );
          }

          // ----------------------------------------------------
          // SAVE SUCCESSFUL PAYMENT
          // ----------------------------------------------------

          const savedOrder = {
            orderNumber,

            customer,

            items: cart,

            total: orderTotal,

            paymentMethod: "UPI / Razorpay",

            paymentStatus: "Paid",

            razorpayOrderId:
              response.razorpay_order_id,

            razorpayPaymentId:
              response.razorpay_payment_id,

            razorpaySignature:
              response.razorpay_signature,

            databaseOrder:
              verifyResult.order ?? null,
          };

          saveLastOrder(savedOrder);

          clearCart();

          router.push("/checkout/success");
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          );

          alert(
            error instanceof Error
              ? error.message
              : "Payment verification failed."
          );

          setIsSubmitting(false);
        }
      },

      modal: {
        ondismiss: function () {
          setIsSubmitting(false);
        },
      },
    };

    // ----------------------------------------------------------
    // OPEN RAZORPAY
    // ----------------------------------------------------------

    const razorpay =
      new window.Razorpay(options);

    razorpay.on(
      "payment.failed",
      function (response: any) {
        console.error(
          "Razorpay payment failed:",
          response
        );

        alert(
          response?.error?.description ||
            "Payment failed. Please try again."
        );

        setIsSubmitting(false);
      }
    );

    razorpay.open();
  };

  // ============================================================
  // PLACE ORDER
  // ============================================================

  const handlePlaceOrder = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");

      router.push("/cart");

      return;
    }

    const customer =
      validateCustomerDetails();

    if (!customer) {
      return;
    }

    setIsSubmitting(true);

    const orderNumber = `NAV-${Date.now()}`;

    try {
      if (paymentMethod === "cod") {
        await placeCashOnDeliveryOrder(
          customer,
          orderNumber
        );

        return;
      }

      await startRazorpayPayment(
        customer,
        orderNumber
      );
    } catch (error) {
      console.error(
        "Could not place order:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsSubmitting(false);
    }
  };

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (cart.length === 0) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#ffffff] pb-24 text-[#171717] md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:px-10 md:py-16">

          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="mt-3 text-3xl tracking-tight md:mt-4 md:text-4xl">
            Checkout
          </h1>

          <div className="mt-8 border-t border-black/10 pt-16 text-center md:mt-12">

            <h2 className="text-xl md:text-2xl">
              Your cart is empty.
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#625d57]">
              Add something from the Navira collection
              to continue.
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-8 rounded-full bg-[#171717] px-8 py-4 text-[10px] font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-80"
            >
              CONTINUE SHOPPING
            </button>

          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // CHECKOUT PAGE
  // ============================================================

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#ffffff] pb-24 text-[#171717] md:pb-0">

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:py-16">

        {/* HEADER */}

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
          NAVIRA 3D
        </p>

        <h1 className="mt-3 text-3xl tracking-tight md:mt-4 md:text-4xl">
          Checkout
        </h1>

        <div className="mt-8 border-t border-black/10 pt-8 md:mt-12 md:pt-10">

          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:gap-12">

            {/* ==================================================
                DELIVERY INFORMATION
            ================================================== */}

            <form
              onSubmit={handlePlaceOrder}
              className="min-w-0"
            >

              <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 md:rounded-none md:border-0 md:bg-transparent md:p-0">

                <p className="text-[10px] uppercase tracking-[0.25em]">
                  Delivery Information
                </p>

                {/* NAME */}

                <div className="mt-7">

                  <label
                    htmlFor="name"
                    className="mb-2.5 block text-sm"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-xl border border-black/20 bg-[#fafafa] px-4 text-base outline-none transition-colors placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:h-16 md:rounded-none"
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="mt-5">

                  <label
                    htmlFor="phone"
                    className="mb-2.5 block text-sm"
                  >
                    Mobile Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-xl border border-black/20 bg-[#fafafa] px-4 text-base outline-none transition-colors placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:h-16 md:rounded-none"
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="mt-5">

                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-sm"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-xl border border-black/20 bg-[#fafafa] px-4 text-base outline-none transition-colors placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:h-16 md:rounded-none"
                    required
                  />

                </div>

                {/* ADDRESS */}

                <div className="mt-5">

                  <label
                    htmlFor="address"
                    className="mb-2.5 block text-sm"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="House number, street, area"
                    autoComplete="street-address"
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-xl border border-black/20 bg-[#fafafa] px-4 py-4 text-base outline-none transition-colors placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:rounded-none"
                    required
                  />

                </div>

                {/* CITY / STATE / PIN */}

                <div className="mt-5 grid gap-5 sm:grid-cols-3">

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2.5 block text-sm"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                      autoComplete="address-level2"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-xl border border-black/20 bg-[#fafafa] px-4 text-base outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:h-16 md:rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2.5 block text-sm"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(event) =>
                        setState(event.target.value)
                      }
                      autoComplete="address-level1"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-xl border border-black/20 bg-[#fafafa] px-4 text-base outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:h-16 md:rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pincode"
                      className="mb-2.5 block text-sm"
                    >
                      PIN Code
                    </label>

                    <input
                      id="pincode"
                      type="text"
                      value={pincode}
                      onChange={(event) =>
                        setPincode(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      placeholder="575001"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      maxLength={6}
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-xl border border-black/20 bg-[#fafafa] px-4 text-base outline-none transition-colors placeholder:text-[#8b837b] focus:border-black disabled:cursor-not-allowed disabled:opacity-60 md:h-16 md:rounded-none"
                      required
                    />
                  </div>

                </div>

                {/* ==================================================
                    PAYMENT METHOD
                ================================================== */}

                <div className="mt-8 border-t border-black/10 pt-7 md:mt-10 md:pt-8">

                  <p className="text-[10px] uppercase tracking-[0.25em]">
                    Payment Method
                  </p>

                  <div className="mt-5 space-y-3">

                    {/* COD */}

                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors md:rounded-none md:p-5 ${
                        paymentMethod === "cod"
                          ? "border-[#171717] bg-white"
                          : "border-black/20 bg-white hover:border-black/40"
                      }`}
                    >

                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={
                          paymentMethod === "cod"
                        }
                        onChange={() =>
                          setPaymentMethod("cod")
                        }
                        disabled={isSubmitting}
                        className="mt-1 h-4 w-4 shrink-0"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          Cash on Delivery
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-[#625d57] sm:text-sm">
                          Pay when your order is delivered.
                        </p>
                      </div>

                    </label>

                    {/* UPI */}

                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors md:rounded-none md:p-5 ${
                        paymentMethod === "upi"
                          ? "border-[#171717] bg-white"
                          : "border-black/20 bg-white hover:border-black/40"
                      }`}
                    >

                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={
                          paymentMethod === "upi"
                        }
                        onChange={() =>
                          setPaymentMethod("upi")
                        }
                        disabled={isSubmitting}
                        className="mt-1 h-4 w-4 shrink-0"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          UPI / Online Payment
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-[#625d57] sm:text-sm">
                          Pay securely using UPI through
                          Razorpay.
                        </p>
                      </div>

                    </label>

                  </div>
                </div>

                {/* ==================================================
                    PLACE ORDER
                ================================================== */}

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (paymentMethod === "upi" &&
                      !razorpayLoaded)
                  }
                  className="mt-7 w-full rounded-full bg-[#c8102e] px-8 py-4 text-[11px] font-bold tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-none"
                >
                  {isSubmitting
                    ? paymentMethod === "upi"
                      ? "OPENING PAYMENT..."
                      : "PROCESSING..."
                    : paymentMethod === "upi"
                      ? "PAY NOW"
                      : "PLACE ORDER"}
                </button>

              </div>

            </form>

            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}

            <aside className="h-fit rounded-2xl border border-black/10 bg-white p-5 sm:p-7 lg:rounded-none">

              <p className="text-[10px] uppercase tracking-[0.25em]">
                Order Summary
              </p>

              <div className="mt-6 space-y-5">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4"
                  >

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#ffffff] sm:h-24 sm:w-24 lg:rounded-none">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />

                    </div>

                    <div className="flex min-w-0 flex-1 justify-between gap-3">

                      <div className="min-w-0">

                        <p className="text-sm font-medium leading-5">
                          {item.name}
                        </p>

                        <p className="mt-1.5 text-xs text-[#625d57]">
                          Quantity: {item.quantity}
                        </p>

                      </div>

                      <p className="whitespace-nowrap text-sm">
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-6 border-t border-black/10 pt-5">

                <div className="flex justify-between text-sm">
                  <span className="text-[#625d57]">
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="mt-4 flex justify-between gap-4 text-sm">

                  <span className="text-[#625d57]">
                    Shipping
                  </span>

                  <span className="text-right text-xs text-[#625d57]">
                    Calculated later
                  </span>

                </div>

                <div className="mt-5 border-t border-black/10 pt-5">

                  <div className="flex justify-between">

                    <span className="text-base">
                      Total
                    </span>

                    <span className="text-lg font-medium">
                      ₹
                      {cartTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </div>

    </main>
  );
}