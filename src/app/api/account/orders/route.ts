import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Read environment variables as strings.
// The empty-string fallback lets TypeScript know these are always strings.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function GET() {
  try {
    // --------------------------------
    // CHECK SERVER CONFIGURATION
    // --------------------------------

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration is missing Supabase credentials.",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // GET LOGGED-IN CUSTOMER
    // --------------------------------

    const authClient = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError) {
      console.error(
        "CUSTOMER AUTH ERROR:",
        userError
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in to view your orders.",
        },
        { status: 401 }
      );
    }

    // --------------------------------
    // GET CUSTOMER EMAIL
    // --------------------------------

    const customerEmail =
      typeof user.email === "string"
        ? user.email.trim().toLowerCase()
        : "";

    if (!customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account does not have an email address.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // SERVER-ONLY SUPABASE CLIENT
    // --------------------------------

    const supabase = createServiceClient(
      supabaseUrl,
      serviceRoleKey
    );

    // --------------------------------
    // GET ONLY THIS CUSTOMER'S ORDERS
    // --------------------------------

    const {
      data: orders,
      error: ordersError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        address,
        city,
        state,
        pincode,
        total,
        payment_method,
        payment_status,
        order_status,
        status,
        created_at
      `)
      .eq("customer_email", customerEmail)
      .order("created_at", {
        ascending: false,
      });

    // --------------------------------
    // DATABASE ERROR
    // --------------------------------

    if (ordersError) {
      console.error(
        "CUSTOMER ORDERS DATABASE ERROR:",
        ordersError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your orders.",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // CUSTOMER DISPLAY NAME
    // --------------------------------

    const fullName =
      typeof user.user_metadata?.full_name ===
        "string" &&
      user.user_metadata.full_name.trim()
        ? user.user_metadata.full_name.trim()
        : typeof user.user_metadata?.name ===
            "string" &&
          user.user_metadata.name.trim()
        ? user.user_metadata.name.trim()
        : customerEmail.split("@")[0];

    // --------------------------------
    // SUCCESS
    // --------------------------------

    return NextResponse.json({
      success: true,

      customer: {
        id: user.id,
        name: fullName,
        email: customerEmail,
      },

      orders: orders ?? [],
    });
  } catch (error) {
    console.error(
      "CUSTOMER ORDERS UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while loading your orders.",
      },
      { status: 500 }
    );
  }
}