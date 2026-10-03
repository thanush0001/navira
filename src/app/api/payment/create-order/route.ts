import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: Request) {
  try {
    // --------------------------------
    // CHECK ENVIRONMENT VARIABLES
    // --------------------------------

    if (!razorpayKeyId) {
      console.error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay Key ID is missing on the server.",
        },
        { status: 500 }
      );
    }

    if (!razorpayKeySecret) {
      console.error("Missing RAZORPAY_KEY_SECRET");

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay secret key is missing on the server.",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // CREATE RAZORPAY CLIENT
    // --------------------------------

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // --------------------------------
    // READ REQUEST
    // --------------------------------

    const body = await request.json();

    const { amount, receipt } = body;

    console.log("Payment create-order request:", {
      amount,
      receipt,
    });

    // --------------------------------
    // VALIDATE AMOUNT
    // --------------------------------

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment amount.",
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment amount.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // CONVERT RUPEES → PAISE
    // --------------------------------

    const amountInPaise = Math.round(
      numericAmount * 100
    );

    if (amountInPaise < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment amount must be at least ₹1.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // RECEIPT
    // --------------------------------

    const cleanReceipt =
      typeof receipt === "string" &&
      receipt.trim().length > 0
        ? receipt.trim()
        : `NAV-${Date.now()}`;

    // --------------------------------
    // CREATE RAZORPAY ORDER
    // --------------------------------

    console.log("Creating Razorpay order:", {
      amountInPaise,
      currency: "INR",
      receipt: cleanReceipt,
    });

    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: cleanReceipt,
      });

    console.log(
      "Razorpay order successfully created:",
      razorpayOrder.id
    );

    // --------------------------------
    // SUCCESS RESPONSE
    // --------------------------------

    return NextResponse.json({
      success: true,

      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },

      keyId: razorpayKeyId,
    });
  } catch (error) {
    console.error(
      "RAZORPAY CREATE ORDER ERROR:",
      error
    );

    let errorMessage =
      "Failed to create Razorpay order.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}