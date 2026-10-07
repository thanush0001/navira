import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

async function getAuthenticatedUser() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// =========================================================
// GET SAVED ADDRESSES
// =========================================================

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("customer_addresses")
      .select(`
        id,
        full_name,
        phone,
        address_line1,
        address_line2,
        landmark,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at
      `)
      .eq("user_id", user.id)
      .order("is_default", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CUSTOMER ADDRESSES GET ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load your addresses.",
        },
        { status: 500 }
      );
    }

    // Convert database "phone" field to the
    // "mobile_number" field expected by the frontend.
    const addresses = (data ?? []).map((address) => ({
      id: address.id,
      full_name: address.full_name,
      mobile_number: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
      created_at: address.created_at,
    }));

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(
      "CUSTOMER ADDRESSES GET UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load your addresses.",
      },
      { status: 500 }
    );
  }
}

// =========================================================
// SAVE NEW ADDRESS
// =========================================================

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const fullName = String(
      body.fullName ?? ""
    ).trim();

    // Frontend sends "mobileNumber".
    // "phone" is also accepted for compatibility.
    const phone = String(
      body.mobileNumber ??
        body.phone ??
        ""
    ).trim();

    const addressLine1 = String(
      body.addressLine1 ?? ""
    ).trim();

    const addressLine2 = String(
      body.addressLine2 ?? ""
    ).trim();

    const landmark = String(
      body.landmark ?? ""
    ).trim();

    const city = String(
      body.city ?? ""
    ).trim();

    const state = String(
      body.state ?? "Karnataka"
    ).trim();

    const postalCode = String(
      body.postalCode ?? ""
    ).trim();

    const country = String(
      body.country ?? "India"
    ).trim();

    const isDefault = Boolean(
      body.isDefault
    );

    // =======================================================
    // VALIDATION
    // =======================================================

    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please fill all required address fields.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid 10-digit mobile number.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(postalCode)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid 6-digit postal pincode.",
        },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // =======================================================
    // RESET EXISTING DEFAULT
    // =======================================================

    if (isDefault) {
      const { error: resetError } =
        await supabase
          .from("customer_addresses")
          .update({
            is_default: false,
          })
          .eq("user_id", user.id);

      if (resetError) {
        console.error(
          "RESET DEFAULT ADDRESS ERROR:",
          resetError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to update your default address.",
          },
          { status: 500 }
        );
      }
    }

    // =======================================================
    // CHECK EXISTING ADDRESS COUNT
    // =======================================================

    const {
      count,
      error: countError,
    } = await supabase
      .from("customer_addresses")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    if (countError) {
      console.error(
        "ADDRESS COUNT ERROR:",
        countError
      );
    }

    // First address automatically becomes default.
    const finalDefault =
      isDefault || !count;

    // =======================================================
    // INSERT ADDRESS
    // =======================================================

    const { data, error } =
      await supabase
        .from("customer_addresses")
        .insert({
          user_id: user.id,
          full_name: fullName,
          phone,
          address_line1: addressLine1,
          address_line2:
            addressLine2 || null,
          landmark: landmark || null,
          city,
          state,
          postal_code: postalCode,
          country,
          is_default: finalDefault,
        })
        .select(`
          id,
          full_name,
          phone,
          address_line1,
          address_line2,
          landmark,
          city,
          state,
          postal_code,
          country,
          is_default,
          created_at
        `)
        .single();

    if (error) {
      console.error(
        "SAVE CUSTOMER ADDRESS ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to save your address.",
        },
        { status: 500 }
      );
    }

    // Return the field name expected by the frontend.
    const address = {
      id: data.id,
      full_name: data.full_name,
      mobile_number: data.phone,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      landmark: data.landmark,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      is_default: data.is_default,
      created_at: data.created_at,
    };

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(
      "CUSTOMER ADDRESS POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save your address.",
      },
      { status: 500 }
    );
  }
}