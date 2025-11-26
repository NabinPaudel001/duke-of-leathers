// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_BASE = "https://leather.ct.ws/";
const WC_CHECKOUT_PATH = "/wp-json/wc/store/v1/checkout";
const WC_CART_PATH = "/wp-json/wc/store/v1/cart";

async function proxyFetch(path: string, options: RequestInit = {}) {
  const url = `${WOOCOMMERCE_BASE}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Accept": "application/json",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const incomingCookies = req.headers.get("cookie") ?? "";
    console.log("=== GET /api/checkout ===");

    const wcRes = await proxyFetch(WC_CHECKOUT_PATH, {
      method: "GET",
      headers: { Cookie: incomingCookies, Accept: "application/json" },
    });

    console.log("WooCommerce GET checkout status:", wcRes.status);
    console.log("WooCommerce GET checkout headers:", Object.fromEntries(wcRes.headers.entries()));

    const text = await wcRes.text();
    const data = text ? JSON.parse(text) : {};

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    
    // Forward ALL relevant headers with proper casing
    const setCookie = wcRes.headers.get("set-cookie");
    const cartToken = wcRes.headers.get("cart-token") || wcRes.headers.get("Cart-Token");
    const nonce = wcRes.headers.get("nonce") || wcRes.headers.get("Nonce");
    const cartHash = wcRes.headers.get("cart-hash") || wcRes.headers.get("Cart-Hash");

    if (setCookie) headers["Set-Cookie"] = setCookie;
    if (cartToken) headers["cart-token"] = cartToken;
    if (nonce) headers["nonce"] = nonce;
    if (cartHash) headers["cart-hash"] = cartHash;

    return new NextResponse(JSON.stringify(data), { status: wcRes.status, headers });
  } catch (err) {
    console.error("GET /api/checkout failed:", err);
    return NextResponse.json({ error: "Failed to fetch checkout" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const incomingCookies = req.headers.get("cookie") ?? "";
    const body = await req.json();
    console.log("=== POST /api/checkout ===");

    // Get tokens from request headers (case-insensitive)
    const clientNonce = 
      req.headers.get("x-wc-store-api-nonce") || 
      req.headers.get("nonce") || 
      req.headers.get("Nonce") || "";
    
    const clientCartToken = 
      req.headers.get("cart-token") || 
      req.headers.get("Cart-Token") || "";

    console.log("Client tokens:", { nonce: !!clientNonce, cartToken: !!clientCartToken });

    if (!clientNonce || !clientCartToken) {
      console.warn("⚠️ Missing tokens, fetching from cart...");
      const cartRes = await proxyFetch(WC_CART_PATH, {
        method: "GET",
        headers: { Cookie: incomingCookies, Accept: "application/json" },
      });

      const cartNonce = 
        cartRes.headers.get("nonce") || 
        cartRes.headers.get("Nonce") || "";
      
      const cartCartToken = 
        cartRes.headers.get("cart-token") || 
        cartRes.headers.get("Cart-Token") || "";

      if (!cartNonce || !cartCartToken) {
        console.error("❌ No tokens available from cart");
        return NextResponse.json({ error: "Missing authentication tokens" }, { status: 401 });
      }

      // Use cart tokens
    //   const nonce = cartNonce;
    //   const cartToken = cartCartToken;
    } else {
    //   nonce = clientNonce;
    //   cartToken = clientCartToken;
    }

    console.log("Using tokens for order creation");

    // Build order data in WooCommerce format
    const orderData = {
      billing_address: body.billing_address,
      shipping_address: body.shipping_address,
      customer_note: body.customer_note || "",
      create_account: false,
      payment_method: body.payment_method,
      payment_data: [],
      extensions: {},
    };

    const wcRes = await proxyFetch(WC_CHECKOUT_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: incomingCookies,
        Accept: "application/json",
        "nonce": clientNonce,
        "Cart-Token": clientCartToken,
      },
      body: JSON.stringify(orderData),
    });

    console.log("WooCommerce POST checkout status:", wcRes.status);
    console.log("WooCommerce POST checkout headers:", Object.fromEntries(wcRes.headers.entries()));

    const text = await wcRes.text();
    const data = text ? JSON.parse(text) : {};

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const setCookie = wcRes.headers.get("set-cookie");
    const newCartToken = wcRes.headers.get("cart-token") || wcRes.headers.get("Cart-Token");
    const newNonce = wcRes.headers.get("nonce") || wcRes.headers.get("Nonce");

    if (setCookie) headers["Set-Cookie"] = setCookie;
    if (newCartToken) headers["cart-token"] = newCartToken;
    if (newNonce) headers["nonce"] = newNonce;

    return new NextResponse(JSON.stringify(data), { status: wcRes.status, headers });
  } catch (err) {
    console.error("POST /api/checkout failed:", err);
    return NextResponse.json({ 
      error: "Failed to create order",
      details: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}