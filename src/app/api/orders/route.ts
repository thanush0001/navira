import { NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createServiceClient(
  supabaseUrl,
  serviceRoleKey
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Received COD order");

    const {
      orderNumber,
      customer,
      items,
      total,
      paymentMethod,
    } = body;

    // =========================================================
    // GET CURRENTLY LOGGED-IN CUSTOMER
    // =========================================================

    const authClient = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError) {
      console.error("AUTH ERROR:", authError);
    }

    // =========================================================
    // VALIDATION
    // =========================================================

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

    // =========================================================
    // ONLY COD IS ALLOWED HERE
    // =========================================================

    if (
      paymentMethod &&
      paymentMethod !== "Cash on Delivery"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid payment method for this endpoint",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // CUSTOMER EMAIL
    //
    // If a customer is logged in, use the authenticated
    // Supabase email.
    //
    // This prevents the checkout form from attaching an order
    // to an unrelated email address.
    // =========================================================

    const authenticatedEmail =
      user?.email?.trim().toLowerCase() || null;

    const checkoutEmail =
      typeof customer.email === "string"
        ? customer.email.trim().toLowerCase()
        : "";

    const customerEmail =
      authenticatedEmail || checkoutEmail;

    if (!customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing customer email. Please sign in or provide an email address.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // CHECK DUPLICATE ORDER
    // =========================================================

    const {
      data: existingOrder,
      error: duplicateCheckError,
    } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (duplicateCheckError) {
      console.error(
        "DUPLICATE ORDER CHECK ERROR:",
        duplicateCheckError
      );

      return NextResponse.json(
        {
          success: false,
          error: duplicateCheckError.message,
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

    // =========================================================
    // CREATE COD ORDER
    // =========================================================

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,

          customer_name: customer.name,
          customer_phone: customer.phone,

          // IMPORTANT:
          // Use authenticated Supabase email when available.
          customer_email: customerEmail,

          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,

          total: Number(total),

          payment_method:
            "Cash on Delivery",

          payment_status: "pending",

          status: "pending",
        })
        .select()
        .single();

    if (orderError) {
      console.error(
        "SUPABASE COD ORDER ERROR:",
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
      "COD order created:",
      order.order_number
    );

    // =========================================================
    // CREATE ORDER ITEMS
    // =========================================================

    const orderItems = items.map(
      (item: any) => ({
        order_id: order.id,

        product_id: item.id,

        product_name: item.name,

        product_image:
          item.image || null,

        price: Number(item.price),

        quantity: Number(item.quantity),
      })
    );

    const {
      data: savedItems,
      error: itemsError,
    } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    // =========================================================
    // ROLLBACK IF ORDER ITEMS FAIL
    // =========================================================

    if (itemsError) {
      console.error(
        "SUPABASE COD ORDER ITEMS ERROR:",
        itemsError
      );

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
      "COD order items created:",
      savedItems?.length ?? 0
    );

    // =========================================================
    // SUCCESS
    // =========================================================

    return NextResponse.json({
      success: true,

      alreadyExists: false,

      order,

      items: savedItems,
    });
  } catch (error) {
    console.error(
      "COD ORDER API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to create COD order",
      },
      { status: 500 }
    );
  }
}