import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // FIND ORDER
    // --------------------------------

    let orderQuery = supabase
      .from("orders")
      .select("*");

    if (isUUID(id)) {
      orderQuery = orderQuery.eq("id", id);
    } else {
      orderQuery = orderQuery.eq(
        "order_number",
        id
      );
    }

    const {
      data: order,
      error: orderError,
    } = await orderQuery.single();

    if (orderError || !order) {
      console.error(
        "GET ORDER ERROR:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            orderError?.message ||
            "Order not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // LOAD ORDER ITEMS
    // --------------------------------

    const {
      data: orderItems,
      error: orderItemsError,
    } = await supabase
      .from("order_items")
      .select(
        `
        id,
        order_id,
        product_id,
        product_name,
        product_image,
        price,
        quantity,
        created_at
        `
      )
      .eq("order_id", order.id)
      .order("created_at", {
        ascending: true,
      });

    if (orderItemsError) {
      console.error(
        "GET ORDER ITEMS ERROR:",
        orderItemsError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            orderItemsError.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // SUCCESS
    // --------------------------------

    return NextResponse.json({
      success: true,
      order,
      order_items: orderItems || [],
    });
  } catch (error) {
    console.error(
      "ORDER DETAILS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load order",
      },
      { status: 500 }
    );
  }
}