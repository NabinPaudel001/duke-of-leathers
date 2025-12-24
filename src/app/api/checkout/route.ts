import { NextRequest, NextResponse } from "next/server";

const BASE = "https://dukeofleathers.no/wp/";
const CHECKOUT = "/wp-json/wc/store/v1/checkout";
const CART = "/wp-json/wc/store/v1/cart";

// Generic fetch wrapper
async function wcFetch(path: string, init: RequestInit = {}) {
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

function extractToken(headers: Headers, key: string) {
  return (
    headers.get(key) ||
    headers.get(key.toLowerCase()) ||
    headers.get(key.toUpperCase()) ||
    ""
  );
}

export async function GET(req: NextRequest) {
  try {
    const cookies = req.headers.get("cookie") ?? "";

    const wcRes = await wcFetch(CHECKOUT, {
      method: "GET",
      headers: { Cookie: cookies },
    });

    // Parse JSON safely
    const text = await wcRes.text();
    const data = text ? JSON.parse(text) : {};

    // Extract headers WooCommerce sends
    const outgoing: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const setCookie = wcRes.headers.get("set-cookie");
    if (setCookie) outgoing["Set-Cookie"] = setCookie;

    const cartToken = extractToken(wcRes.headers, "cart-token");
    const nonce = extractToken(wcRes.headers, "nonce");
    const cartHash = extractToken(wcRes.headers, "cart-hash");

    if (cartToken) outgoing["cart-token"] = cartToken;
    if (nonce) outgoing["nonce"] = nonce;
    if (cartHash) outgoing["cart-hash"] = cartHash;

    return new NextResponse(JSON.stringify(data), {
      status: wcRes.status,
      headers: outgoing,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch checkout" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookies = req.headers.get("cookie") ?? "";
    const body = await req.json();

    // First try to read tokens from client request (best case)
    let nonce = extractToken(req.headers, "x-wc-store-api-nonce") ||
                extractToken(req.headers, "nonce");

    let cartToken = extractToken(req.headers, "cart-token");

    // If missing → fetch cart to get fresh tokens
    if (!nonce || !cartToken) {
      const cartRes = await wcFetch(CART, {
        method: "GET",
        headers: { Cookie: cookies },
      });

      nonce = extractToken(cartRes.headers, "nonce");
      cartToken = extractToken(cartRes.headers, "cart-token");

      if (!nonce || !cartToken) {
        return NextResponse.json(
          { error: "Missing authentication tokens" },
          { status: 401 }
        );
      }
    }

    // Prepare WooCommerce checkout data
    const orderData = {
      billing_address: body.billing_address,
      shipping_address: body.shipping_address,
      customer_note: body.customer_note || "",
      create_account: false,
      payment_method: body.payment_method,
      payment_data: [],
      extensions: {},
    };

    const wcRes = await wcFetch(CHECKOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
        "nonce": nonce,
        "cart-token": cartToken,
      },
      body: JSON.stringify(orderData),
    });

    const responseText = await wcRes.text();
    const responseData = responseText ? JSON.parse(responseText) : {};

    const outgoing: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const newSetCookie = wcRes.headers.get("set-cookie");
    if (newSetCookie) outgoing["Set-Cookie"] = newSetCookie;

    const newNonce = extractToken(wcRes.headers, "nonce");
    const newCartToken = extractToken(wcRes.headers, "cart-token");

    if (newNonce) outgoing["nonce"] = newNonce;
    if (newCartToken) outgoing["cart-token"] = newCartToken;

    return new NextResponse(JSON.stringify(responseData), {
      status: wcRes.status,
      headers: outgoing,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create order", details: err.message },
      { status: 500 }
    );
  }
}
