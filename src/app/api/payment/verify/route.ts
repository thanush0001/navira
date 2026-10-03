import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // --------------------------------
    // ENVIRONMENT VARIABLES
    // --------------------------------

    const razorpayKeySecret =
      process.env.RAZORPAY_KEY_SECRET;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!razorpayKeySecret) {
      console.error(
        "Missing RAZORPAY_KEY_SECRET"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay secret key is not configured",
        },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing Supabase environment variables"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are not configured",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    // --------------------------------
    // READ REQUEST
    // --------------------------------

    const body = await request.json();

    const {
      orderNumber,
      customer,
      items,
      total,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // --------------------------------
    // VALIDATION
    // --------------------------------

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order number",
        },
        { status: 400 }
      );
    }

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing customer information",
        },
        { status: 400 }
      );
    }

    if (!customer.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing customer name",
        },
        { status: 400 }
      );
    }

    if (!customer.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing customer phone",
        },
        { status: 400 }
      );
    }

    if (!customer.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing customer email",
        },
        { status: 400 }
      );
    }

    if (!customer.address) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing delivery address",
        },
        { status: 400 }
      );
    }

    if (!customer.city) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing city",
        },
        { status: 400 }
      );
    }

    if (!customer.state) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing state",
        },
        { status: 400 }
      );
    }

    if (!customer.pincode) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing PIN code",
        },
        { status: 400 }
      );
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Order has no items",
        },
        { status: 400 }
      );
    }

    if (
      total === undefined ||
      total === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order total",
        },
        { status: 400 }
      );
    }

    if (!razorpay_order_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay order ID",
        },
        { status: 400 }
      );
    }

    if (!razorpay_payment_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay payment ID",
        },
        { status: 400 }
      );
    }

    if (!razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay signature",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // VERIFY RAZORPAY SIGNATURE
    // --------------------------------

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        razorpayKeySecret
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      console.error(
        "Invalid Razorpay signature"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
        },
        { status: 400 }
      );
    }

    console.log(
      "Razorpay payment verified:",
      razorpay_payment_id
    );

    // --------------------------------
    // CHECK EXISTING ORDER
    // --------------------------------

    const {
      data: existingOrder,
      error: existingOrderError,
    } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (existingOrderError) {
      console.error(
        "CHECK EXISTING ORDER ERROR:",
        existingOrderError
      );

      return NextResponse.json(
        {
          success: false,
          error: existingOrderError.message,
        },
        { status: 500 }
      );
    }

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        order: existingOrder,
      });
    }

    // --------------------------------
    // CREATE PAID ORDER
    // --------------------------------

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,

        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,

        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,

        total: total,

        payment_method: "UPI / Razorpay",

        status: "paid",

        razorpay_order_id:
          razorpay_order_id,

        razorpay_payment_id:
          razorpay_payment_id,
      })
      .select()
      .single();

    if (orderError) {
      console.error(
        "SUPABASE PAID ORDER ERROR:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error: orderError.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "Paid order created:",
      order
    );

    // --------------------------------
    // CREATE ORDER ITEMS
    // --------------------------------

    const orderItems = items.map(
      (item: {
        id: string;
        name: string;
        image?: string;
        price: number;
        quantity: number;
      }) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image || null,
        price: item.price,
        quantity: item.quantity,
      })
    );

    const {
      data: savedItems,
      error: itemsError,
    } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error(
        "SUPABASE PAID ORDER ITEMS ERROR:",
        itemsError
      );

      // Roll back the order if items fail
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          error: itemsError.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "Paid order items created:",
      savedItems
    );

    // --------------------------------
    // SUCCESS
    // --------------------------------

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      message:
        "Payment verified and order created successfully",
      order,
      items: savedItems,
    });
  } catch (error) {
    console.error(
      "RAZORPAY VERIFY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed",
      },
      { status: 500 }
    );
  }
}