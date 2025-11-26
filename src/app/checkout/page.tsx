"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

// Types
interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  prices: { price: string };
  images: { src: string }[];
}

interface CartTotals {
  total_items: string;
  total_price: string;
  total_tax: string;
  total_shipping: string;
}

interface CartData {
  items: CartItem[];
  totals: CartTotals;
  shippingRates: any[];
  needsShipping: boolean;
}

interface CheckoutFormData {
  email: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_state: string;
  billing_postcode: string;
  billing_country: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_country: string;
  order_comments: string;
  payment_method: string;
  terms: boolean;
  same_as_billing: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cart, 
    loading: cartLoading, 
    refreshCart,
    createOrder,
    nonce,
    cartToken
  } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    billing_first_name: "",
    billing_last_name: "",
    billing_address_1: "",
    billing_address_2: "",
    billing_city: "",
    billing_state: "",
    billing_postcode: "",
    billing_country: "NO",
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_address_1: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postcode: "",
    shipping_country: "NO",
    order_comments: "",
    payment_method: "cod",
    terms: false,
    same_as_billing: true
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>("");
  const [showOrderNotes, setShowOrderNotes] = useState(false);

  const items = cart?.items || [];
  const totals = cart?.totals;

  // Fetch checkout configuration
  useEffect(() => {
    const fetchCheckoutConfig = async () => {
      if (!nonce || !cartToken) return;
      
      try {
        const res = await fetch('/api/checkout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WC-Store-API-Nonce': nonce,
            'Cart-Token': cartToken,
          },
          credentials: 'include',
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
      } catch (err) {
        console.error("Failed to fetch checkout config:", err);
      }
    };

    fetchCheckoutConfig();
  }, [nonce, cartToken]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Billing validation (always required)
    if (!formData.billing_first_name.trim()) newErrors.billing_first_name = "First name is required";
    if (!formData.billing_last_name.trim()) newErrors.billing_last_name = "Last name is required";
    if (!formData.billing_address_1.trim()) newErrors.billing_address_1 = "Address is required";
    if (!formData.billing_city.trim()) newErrors.billing_city = "City is required";
    if (!formData.billing_postcode.trim()) newErrors.billing_postcode = "Postcode is required";

    // Shipping validation (only if not same as billing)
    if (!formData.same_as_billing) {
      if (!formData.shipping_first_name.trim()) newErrors.shipping_first_name = "First name is required";
      if (!formData.shipping_last_name.trim()) newErrors.shipping_last_name = "Last name is required";
      if (!formData.shipping_address_1.trim()) newErrors.shipping_address_1 = "Address is required";
      if (!formData.shipping_city.trim()) newErrors.shipping_city = "City is required";
      if (!formData.shipping_postcode.trim()) newErrors.shipping_postcode = "Postcode is required";
    }

    if (!formData.terms) newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting checkout form with data:", formData);
    e.preventDefault();

    if (!validateForm() || !cart) {
      console.warn("Form validation failed or cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      // Format according to WooCommerce API spec
      const orderData = {
        billing_address: {
          first_name: formData.billing_first_name,
          last_name: formData.billing_last_name,
          address_1: formData.billing_address_1,
          address_2: formData.billing_address_2,
          city: formData.billing_city,
          state: formData.billing_state,
          postcode: formData.billing_postcode,
          country: formData.billing_country,
          email: formData.email,
          phone: "",
        },
        shipping_address: {
          first_name: formData.same_as_billing ? formData.billing_first_name : formData.shipping_first_name,
          last_name: formData.same_as_billing ? formData.billing_last_name : formData.shipping_last_name,
          address_1: formData.same_as_billing ? formData.billing_address_1 : formData.shipping_address_1,
          address_2: formData.same_as_billing ? formData.billing_address_2 : formData.shipping_address_2,
          city: formData.same_as_billing ? formData.billing_city : formData.shipping_city,
          state: formData.same_as_billing ? formData.billing_state : formData.shipping_state,
          postcode: formData.same_as_billing ? formData.billing_postcode : formData.shipping_postcode,
          country: formData.same_as_billing ? formData.billing_country : formData.shipping_country,
        },
        customer_note: formData.order_comments,
        create_account: false,
        payment_method: formData.payment_method,
        extensions: {},
      };

      const result = await createOrder(orderData);
      console.log("✅ Order created:", result);
      
      if (result.payment_result?.redirect_url) {
        window.location.href = result.payment_result.redirect_url;
      } else {
        refreshCart();
        router.push("/thank-you");
      }

    } catch (error: any) {
      console.error("❌ Checkout failed:", error);
      let message = "Failed to place order. Please try again.";
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return <div className="min-h-screen py-20 text-center">Loading checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products" className="px-6 py-3 bg-red-600 text-white rounded-xl">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Contact information</h2>
              <p className="text-sm text-gray-600 mb-4">We will use this email to send you details and updates about your order.</p>

              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <p className="text-xs text-gray-500">You are currently checking out as a guest.</p>
            </div>

            {/* Billing Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Billing address</h2>
              <p className="text-sm text-gray-600 mb-4">Enter your billing information.</p>

              {/* Country/Region */}
              <div className="mb-4">
                <select
                  name="billing_country"
                  value={formData.billing_country}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 ${errors.billing_country ? 'border-red-500' : ''}`}
                >
                  <option value="">Country/Region</option>
                  <option value="NO">Norway</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
                {errors.billing_country && <p className="text-red-500 text-sm mt-1">{errors.billing_country}</p>}
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="billing_first_name"
                    value={formData.billing_first_name}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 ${errors.billing_first_name ? 'border-red-500' : ''}`}
                    placeholder="First name"
                  />
                  {errors.billing_first_name && <p className="text-red-500 text-sm mt-1">{errors.billing_first_name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="billing_last_name"
                    value={formData.billing_last_name}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 ${errors.billing_last_name ? 'border-red-500' : ''}`}
                    placeholder="Last name"
                  />
                  {errors.billing_last_name && <p className="text-red-500 text-sm mt-1">{errors.billing_last_name}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <input
                  type="text"
                  name="billing_address_1"
                  value={formData.billing_address_1}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 ${errors.billing_address_1 ? 'border-red-500' : ''}`}
                  placeholder="Address"
                />
                {errors.billing_address_1 && <p className="text-red-500 text-sm mt-1">{errors.billing_address_1}</p>}
              </div>

              {/* Apartment/Suite */}
              <div className="mb-4">
                <input
                  type="text"
                  name="billing_address_2"
                  value={formData.billing_address_2}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              {/* Postal Code and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="billing_postcode"
                    value={formData.billing_postcode}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 ${errors.billing_postcode ? 'border-red-500' : ''}`}
                    placeholder="Postal code"
                  />
                  {errors.billing_postcode && <p className="text-red-500 text-sm mt-1">{errors.billing_postcode}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="billing_city"
                    value={formData.billing_city}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 ${errors.billing_city ? 'border-red-500' : ''}`}
                    placeholder="City"
                  />
                  {errors.billing_city && <p className="text-red-500 text-sm mt-1">{errors.billing_city}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address Toggle */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="same-as-billing"
                  name="same_as_billing"
                  checked={formData.same_as_billing}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="same-as-billing" className="text-sm font-medium">
                  Billing and shipping addresses are the same
                </label>
              </div>
            </div>

            {/* Shipping Address (only shown when not same as billing) */}
            {!formData.same_as_billing && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
                <p className="text-sm text-gray-600 mb-4">Enter the address where you want your order delivered.</p>

                {/* Country/Region */}
                <div className="mb-4">
                  <select
                    name="shipping_country"
                    value={formData.shipping_country}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 ${errors.shipping_country ? 'border-red-500' : ''}`}
                  >
                    <option value="">Country/Region</option>
                    <option value="NO">Norway</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                  {errors.shipping_country && <p className="text-red-500 text-sm mt-1">{errors.shipping_country}</p>}
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="shipping_first_name"
                      value={formData.shipping_first_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 ${errors.shipping_first_name ? 'border-red-500' : ''}`}
                      placeholder="First name"
                    />
                    {errors.shipping_first_name && <p className="text-red-500 text-sm mt-1">{errors.shipping_first_name}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="shipping_last_name"
                      value={formData.shipping_last_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 ${errors.shipping_last_name ? 'border-red-500' : ''}`}
                      placeholder="Last name"
                    />
                    {errors.shipping_last_name && <p className="text-red-500 text-sm mt-1">{errors.shipping_last_name}</p>}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="shipping_address_1"
                    value={formData.shipping_address_1}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 ${errors.shipping_address_1 ? 'border-red-500' : ''}`}
                    placeholder="Address"
                  />
                  {errors.shipping_address_1 && <p className="text-red-500 text-sm mt-1">{errors.shipping_address_1}</p>}
                </div>

                {/* Apartment/Suite */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="shipping_address_2"
                    value={formData.shipping_address_2}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                {/* Postal Code and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="shipping_postcode"
                      value={formData.shipping_postcode}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 ${errors.shipping_postcode ? 'border-red-500' : ''}`}
                      placeholder="Postal code"
                    />
                    {errors.shipping_postcode && <p className="text-red-500 text-sm mt-1">{errors.shipping_postcode}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 ${errors.shipping_city ? 'border-red-500' : ''}`}
                      placeholder="City"
                    />
                    {errors.shipping_city && <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Payment options</h2>

              <div className="space-y-2">
                <div
                  className={`border rounded-md p-4 cursor-pointer ${
                    formData.payment_method === "bacs" ? 'border-red-700 bg-red-50' : 'border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, payment_method: "bacs"})}
                >
                  <div className="flex items-center">
                    {formData.payment_method === "bacs" && (
                      <svg className="h-5 w-5 text-red-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>Direct bank transfer</span>
                  </div>
                </div>

                <div
                  className={`border rounded-md p-4 cursor-pointer ${
                    formData.payment_method === "cod" ? 'border-red-700 bg-red-50' : 'border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, payment_method: "cod"})}
                >
                  <div className="flex items-center">
                    {formData.payment_method === "cod" && (
                      <svg className="h-5 w-5 text-red-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>Cash on delivery</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pay with cash upon delivery.</p>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="add-note"
                  checked={showOrderNotes}
                  onChange={(e) => setShowOrderNotes(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="add-note" className="text-sm">
                  Add a note to your order
                </label>
              </div>

              {showOrderNotes && (
                <div className="mt-4">
                  <textarea
                    name="order_comments"
                    value={formData.order_comments}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Notes about your order, e.g. special notes for delivery"
                  />
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="border-t pt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                />
                <label htmlFor="terms" className="text-sm">
                  By proceeding with your purchase you agree to our{' '}
                  <a href="#" className="text-red-700 hover:underline">Terms and Conditions</a> and{' '}
                  <a href="#" className="text-red-700 hover:underline">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center mt-8">
              <Link href="/cart" className="text-red-700 hover:text-red-800 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m7 7l7-7m-7 7v6m6-6h6" />
                </svg>
                Return to Cart
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="bg-red-700 text-white py-3 px-8 rounded-xl hover:bg-red-800 transition disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order summary</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  <img
                    src={item.images[0]?.src || "/placeholder.png"}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-red-700 font-bold">
                        ${(Number(item.prices.price) * item.quantity / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>${(Number(totals?.total_price) / 100).toFixed(2)}</span>
              </div>

              {cart?.needsShipping && (
                <div className="flex justify-between py-2">
                  <span>Free shipping</span>
                  <span>FREE</span>
                </div>
              )}

              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total</span>
                <span>${(Number(totals?.total_price) / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}