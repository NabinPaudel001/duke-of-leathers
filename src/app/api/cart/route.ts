// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_BASE_URL = "https://wp.dukeofleathers.no/";

// Helper to proxy requests to WooCommerce
async function proxyToWooCommerce(
  path: string, 
  options: RequestInit = {}
) {
  const url = `${WOOCOMMERCE_BASE_URL}${path}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      // Ensure we're not sending Next.js-specific headers that might interfere
      'accept-encoding': 'identity', // Avoid compression issues
    }
  });

  return response;
}

// -----------------------------------------------------
// GET CART
// -----------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    console.log("=== GET /api/cart ===");
    const cookies = req.headers.get("cookie") || "";
    console.log("Incoming cookies:", cookies);
    
    const wcRes = await proxyToWooCommerce("/wp-json/wc/store/v1/cart", {
      method: "GET",
      headers: {
        Cookie: cookies,
        Accept: "application/json",
      },
    });

    console.log("WooCommerce GET response status:", wcRes.status);
    console.log("WooCommerce GET response headers:", Object.fromEntries(wcRes.headers.entries()));

    // Clone the response and add necessary headers
    const data = await wcRes.json();
    console.log("WooCommerce GET response ", JSON.stringify(data, null, 2));
    
    const response = new NextResponse(JSON.stringify(data), {
      status: wcRes.status,
      headers: {
        "Content-Type": "application/json",
        // Copy all relevant headers from WooCommerce response
        ...(wcRes.headers.get("set-cookie") && { 
          "Set-Cookie": wcRes.headers.get("set-cookie")! 
        }),
        ...(wcRes.headers.get("cart-token") && { 
          "cart-token": wcRes.headers.get("cart-token")! 
        }),
        ...(wcRes.headers.get("cart-hash") && { 
          "cart-hash": wcRes.headers.get("cart-hash")! 
        }),
        ...(wcRes.headers.get("nonce") && { 
          "nonce": wcRes.headers.get("nonce")! 
        }),
      },
    });

    console.log("Sending response headers:", Object.fromEntries(response.headers.entries()));
    return response;

  } catch (err) {
    console.error("GET /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// -----------------------------------------------------
// ADD TO CART
// -----------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/cart ===");
    const cookies = req.headers.get("cookie") || "";
    const body = await req.json();

    console.log("Incoming cookies:", cookies);
    console.log("Request body:", body);

    const nonce = req.headers.get("x-wc-nonce") || req.headers.get("x-wc-store-api-nonce") || "";
    const cartTokenHeader = req.headers.get("cart-token") || "";

    console.log("Using headers:", {
      nonce,
      cartTokenHeader
    });

    if (!body.productId) {
      console.log("Missing productId in request body");
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const wcRes = await proxyToWooCommerce("/wp-json/wc/store/v1/cart/add-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
        Accept: "application/json",
        "X-WC-Store-API-Nonce": nonce,
        "Cart-Token": cartTokenHeader,
      },
      body: JSON.stringify({
        id: body.productId,
        quantity: body.quantity ?? 1,
      }),
    });

    console.log("WooCommerce ADD response status:", wcRes.status);
    console.log("WooCommerce ADD response headers:", Object.fromEntries(wcRes.headers.entries()));

    const data = await wcRes.json();
    console.log("WooCommerce ADD response ", JSON.stringify(data, null, 2));

    const response = new NextResponse(JSON.stringify(data), {
      status: wcRes.status,
      headers: {
        "Content-Type": "application/json",
        // Copy all relevant headers from WooCommerce response
        ...(wcRes.headers.get("set-cookie") && { 
          "Set-Cookie": wcRes.headers.get("set-cookie")! 
        }),
        ...(wcRes.headers.get("cart-token") && { 
          "cart-token": wcRes.headers.get("cart-token")! 
        }),
        ...(wcRes.headers.get("cart-hash") && { 
          "cart-hash": wcRes.headers.get("cart-hash")! 
        }),
        ...(wcRes.headers.get("nonce") && { 
          "nonce": wcRes.headers.get("nonce")! 
        }),
      },
    });

    console.log("Sending response headers:", Object.fromEntries(response.headers.entries()));
    return response;

  } catch (err) {
    console.error("POST /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

// -----------------------------------------------------
// UPDATE CART ITEM
// -----------------------------------------------------
export async function PUT(req: NextRequest) {
  try {
    console.log("=== PUT /api/cart ===");
    const cookies = req.headers.get("cookie") || "";
    const body = await req.json();

    console.log("Incoming cookies:", cookies);
    console.log("Request body:", body);

    const nonce = req.headers.get("x-wc-nonce") || req.headers.get("x-wc-store-api-nonce") || "";
    const cartTokenHeader = req.headers.get("cart-token") || "";

    console.log("Using headers:", {
      nonce,
      cartTokenHeader
    });

    if (!body.key) {
      console.log("Missing item key in request body");
      return NextResponse.json({ error: "Missing item key" }, { status: 400 });
    }

    const wcRes = await proxyToWooCommerce("/wp-json/wc/store/v1/cart/update-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
        Accept: "application/json",
        "X-WC-Store-API-Nonce": nonce,
        "Cart-Token": cartTokenHeader,
      },
      body: JSON.stringify({
        key: body.key,
        quantity: body.quantity,
      }),
    });

    console.log("WooCommerce UPDATE response status:", wcRes.status);
    console.log("WooCommerce UPDATE response headers:", Object.fromEntries(wcRes.headers.entries()));

    const data = await wcRes.json();
    console.log("WooCommerce UPDATE response ", JSON.stringify(data, null, 2));

    const response = new NextResponse(JSON.stringify(data), {
      status: wcRes.status,
      headers: {
        "Content-Type": "application/json",
        // Copy all relevant headers from WooCommerce response
        ...(wcRes.headers.get("set-cookie") && { 
          "Set-Cookie": wcRes.headers.get("set-cookie")! 
        }),
        ...(wcRes.headers.get("cart-token") && { 
          "cart-token": wcRes.headers.get("cart-token")! 
        }),
        ...(wcRes.headers.get("cart-hash") && { 
          "cart-hash": wcRes.headers.get("cart-hash")! 
        }),
        ...(wcRes.headers.get("nonce") && { 
          "nonce": wcRes.headers.get("nonce")! 
        }),
      },
    });

    console.log("Sending response headers:", Object.fromEntries(response.headers.entries()));
    return response;

  } catch (err) {
    console.error("PUT /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// -----------------------------------------------------
// REMOVE FROM CART
// -----------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    console.log("=== DELETE /api/cart ===");
    const cookies = req.headers.get("cookie") || "";
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    console.log("Incoming cookies:", cookies);
    console.log("Query key parameter:", key);

    const nonce = req.headers.get("x-wc-nonce") || req.headers.get("x-wc-store-api-nonce") || "";
    const cartTokenHeader = req.headers.get("cart-token") || "";

    console.log("Using headers:", {
      nonce,
      cartTokenHeader
    });

    if (!key) {
      console.log("Missing item key in query parameters");
      return NextResponse.json({ error: "Missing item key" }, { status: 400 });
    }

    const wcRes = await proxyToWooCommerce("/wp-json/wc/store/v1/cart/remove-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
        Accept: "application/json",
        "X-WC-Store-API-Nonce": nonce,
        "Cart-Token": cartTokenHeader,
      },
      body: JSON.stringify({
        key: key,
      }),
    });

    console.log("WooCommerce REMOVE response status:", wcRes.status);
    console.log("WooCommerce REMOVE response headers:", Object.fromEntries(wcRes.headers.entries()));

    const data = await wcRes.json();
    console.log("WooCommerce REMOVE response ", JSON.stringify(data, null, 2));

    const response = new NextResponse(JSON.stringify(data), {
      status: wcRes.status,
      headers: {
        "Content-Type": "application/json",
        // Copy all relevant headers from WooCommerce response
        ...(wcRes.headers.get("set-cookie") && { 
          "Set-Cookie": wcRes.headers.get("set-cookie")! 
        }),
        ...(wcRes.headers.get("cart-token") && { 
          "cart-token": wcRes.headers.get("cart-token")! 
        }),
        ...(wcRes.headers.get("cart-hash") && { 
          "cart-hash": wcRes.headers.get("cart-hash")! 
        }),
        ...(wcRes.headers.get("nonce") && { 
          "nonce": wcRes.headers.get("nonce")! 
        }),
      },
    });

    console.log("Sending response headers:", Object.fromEntries(response.headers.entries()));
    return response;

  } catch (err) {
    console.error("DELETE /api/cart failed:", err);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}