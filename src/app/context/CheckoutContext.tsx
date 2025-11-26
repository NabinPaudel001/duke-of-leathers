// app/context/CheckoutContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./CartContext"; // Import useCart to get tokens
import axios from "axios";

// Set axios to include credentials (cookies) by default
axios.defaults.withCredentials = true;

interface CheckoutData {
  accepted_payment_methods: string[];
  customer_id: number;
  billing_address: any;
  shipping_address: any;
  needs_shipping: boolean;
  needs_payment: boolean;
  display_prices_including_tax: boolean;
  locale: string;
  currency: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
  is_calculation_fees: boolean;
  is_calculation_taxes: boolean;
  should_address_match: boolean;
  customer_note: string;
  shipping_rates: any[];
  payment_methods: any[];
  extensions: any;
  // Remove nonce/cartToken/cartHash from here, get from CartContext
}

interface CheckoutContextProps {
  checkout: CheckoutData | null;
  loading: boolean;
  // Remove refreshCheckout, we'll fetch config when placing order if needed
  createOrder: (orderData: any) => Promise<any>;
  // Get tokens from CartContext
  nonce: string;
  cartToken: string;
  cartHash: string;
}

const CheckoutContext = createContext<CheckoutContextProps | null>(null);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get tokens from CartContext
  const { nonce: cartNonce, cartToken: cartCartToken, cartHash: cartCartHash, loading: cartLoading } = useCart();

  // Function to fetch checkout configuration (call this when needed, maybe before order creation)
  const fetchCheckoutConfig = async () => {
    if (!cartNonce || !cartCartToken) {
        console.warn("Tokens not available, skipping checkout config fetch.");
        return null; // Return null or default config if tokens are missing
    }

    try {
      const res = await axios.get("/api/checkout", {
        withCredentials: true,
        headers: {
          "X-WC-Store-API-Nonce": cartNonce,
          "Cart-Token": cartCartToken,
        },
      });

      const  CheckoutData = res.data;
      setCheckout(data);
      return data; // Return the fetched config
    } catch (err: any) {
      console.error("Fetch checkout config failed:", err);
      // Optionally return a default configuration or re-throw
      // For now, we'll just log and return null, allowing the order creation to proceed
      return null;
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      setLoading(true);
      if (!cartNonce || !cartCartToken) {
        throw new Error("Authentication tokens are missing. Cannot create order.");
      }

      const res = await axios.post(
        "/api/checkout",
        orderData,
        {
          headers: {
            "X-WC-Store-API-Nonce": cartNonce,
            "Cart-Token": cartCartToken,
          },
          withCredentials: true,
        }
      );

      return res.data;
    } catch (err) {
      console.error("Create order failed:", err);
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  // Fetch config once tokens are available from CartContext
  useEffect(() => {
    if (!cartLoading && cartNonce && cartCartToken) {
      fetchCheckoutConfig().finally(() => setLoading(false));
    } else if (cartLoading) {
      // If cart is still loading, keep loading state true
      setLoading(true);
    }
    // If cart is loaded but tokens are still missing, set loading to false but warn
    else if (!cartLoading && (!cartNonce || !cartCartToken)) {
      console.warn("Cart loaded but tokens are missing.");
      setLoading(false);
    }
  }, [cartNonce, cartCartToken, cartLoading]); // Only run when these values change


  // Provide tokens from CartContext and the createOrder function
  const value = {
    checkout,
    loading,
    createOrder,
    nonce: cartNonce,
    cartToken: cartCartToken,
    cartHash: cartCartHash,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
};