import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminSupabase = createAdminClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

const allowedStatuses = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus =
  (typeof allowedStatuses)[number];

export async function PATCH(request: Request) {
  try {
    // --------------------------------
    // CHECK AUTHENTICATION
    // --------------------------------

    const supabase = await createServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // --------------------------------
    // READ REQUEST
    // --------------------------------

    const body = await request.json();

    const { orderId, orderStatus } = body;

    // --------------------------------
    // VALIDATE ORDER ID
    // --------------------------------

    if (
      !orderId ||
      typeof orderId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // VALIDATE STATUS
    // --------------------------------

    if (
      !orderStatus ||
      !allowedStatuses.includes(
        orderStatus as OrderStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order status",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // UPDATE ORDER
    // --------------------------------

    const { data, error } =
      await adminSupabase
        .from("orders")
        .update({
          order_status: orderStatus,
        })
        .eq("id", orderId)
        .select()
        .single();

    if (error) {
      console.error(
        "ORDER STATUS UPDATE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // SUCCESS
    // --------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Order status updated successfully",
      order: data,
    });
  } catch (error) {
    console.error(
      "ORDER STATUS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      },
      { status: 500 }
    );
  }
}