// app/context/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Set axios to include credentials (cookies) by default
axios.defaults.withCredentials = true;

interface CartItem {
  key: string;
  id: number;
  prices: { price: string };
  quantity: number;
  name: string;
  totals: { line_total: string };
  images: { src: string }[];
}

interface CartTotals {
  total_items: string;
  total_price: string;
}

interface CartData {
  coupons: any[];
  shippingRates: any[];
  shippingAddress: any;
  billingAddress: any;
  items: CartItem[];
  itemsCount: number;
  itemsWeight: number;
  crossSells: any[];
  needsShipping: boolean;
  needsPayment: boolean;
  hasCalculatedShipping: boolean;
  fees: any[];
  totals: CartTotals;
  errors: any[];
  paymentMethods: any[];
  paymentRequirements: any[];
  extensions: any;
  nonce?: string;
  cartToken?: string;
  cartHash?: string;
}

interface CartContextProps {
  cart: CartData | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  createOrder: (orderData: any) => Promise<any>; // ← ADDED CHECKOUT
  totalItems: number;
  // Expose tokens if needed directly
  nonce: string;
  cartToken: string;
  cartHash: string;
}

const CartContext = createContext<CartContextProps | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);

  // Store latest nonce/cartToken for use with mutating calls
  const [nonce, setNonce] = useState("");
  const [cartToken, setCartToken] = useState("");
  const [cartHash, setCartHash] = useState("");

  const refreshCart = async () => {
    try {
      console.log("=== Refreshing Cart ===");
      
      const res = await axios.get("/api/cart", { 
        withCredentials: true,
        // Do NOT send nonce/cartToken on GET — they may not exist yet
      });
      
      console.log("API response ", res);
      console.log("API response headers:", res.headers);
      
      const data: CartData = res.data;
      setCart(data);

      // Update tokens from response headers
      if (res.headers["nonce"]) {
        setNonce(res.headers["nonce"]);
        console.log("Updated nonce from response header");
      }
      if (res.headers["cart-token"]) {
        setCartToken(res.headers["cart-token"]);
        console.log("Updated cart-token from response header");
      }
      if (res.headers["cart-hash"]) {
        setCartHash(res.headers["cart-hash"]);
        console.log("Updated cart-hash from response header");
      }
      
      // Also check response body (some setups return here)
      // if (data.nonce) setNonce(data.nonce);
      if (data.cartToken) setCartToken(data.cartToken);
      if (data.cartHash) setCartHash(data.cartHash);
    } catch (err) {
      console.error("Fetch cart failed:", err);
    }
  };

  const createOrder = async (orderData: any) => {
    console.log("checkout nonce", nonce);
    console.log("Using tokens for order creation:", { nonce, cartToken });
    if (!nonce || !cartToken) {
      console.warn("⚠️ Tokens missing, refreshing cart...");
      await refreshCart();
    }
    if (!nonce || !cartToken) {
      throw new Error("Authentication tokens missing. Refresh cart and try again.");
    }

    try {
      console.log("=== Creating Order ===");
      console.log("Order data:", orderData);

      const res = await axios.post(
        "/api/checkout",
        orderData,
        {
          headers: {
            "nonce": nonce,
            // "Cart-Token": cartToken,
          },
          withCredentials: true,
        }
      );

      console.log("✅ Order created successfully:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      throw err;
    }
  };

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      console.log("=== Adding to Cart ===", { productId, quantity });
      console.log("I am inside the cart context")
      
      setLoading(true);
      const res = await axios.post(
        "/api/cart",
        { productId, quantity },
        {
          headers: {
            "X-WC-Store-API-Nonce": nonce,
            "Cart-Token": cartToken,
          },
          withCredentials: true,
        }
      );

      console.log("Add to cart responseeee:", res);
      await refreshCart();
    } catch (err) {
      console.error("Add to cart failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (key: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/cart?key=${encodeURIComponent(key)}`, {
        headers: {
          "X-WC-Store-API-Nonce": nonce,
          "Cart-Token": cartToken,
        },
        withCredentials: true,
      });
      await refreshCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (key: string, quantity: number) => {
    try {
      setLoading(true);
      await axios.put(
        "/api/cart",
        { key, quantity },
        {
          headers: {
            "X-WC-Store-API-Nonce": nonce,
            "Cart-Token": cartToken,
          },
          withCredentials: true,
        }
      );
      await refreshCart();
    } catch (err) {
      console.error("Update quantity failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, []);

  const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        createOrder, // ← EXPOSED
        totalItems,
        nonce,
        cartToken,
        cartHash,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};