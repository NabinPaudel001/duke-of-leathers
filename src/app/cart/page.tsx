// app/cart/page.tsx
"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, removeFromCart, updateQuantity, refreshCart } = useCart();

  const items = cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  console.log("Cart in CartPage:", cart?.nonce);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading cart...</p>;

  if (items.length === 0)
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/products")}
          className="px-6 py-3 bg-red-600 text-white rounded-xl"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <section className="min-h-screen py-10 bg-gray-50">
     
      <div className="max-w-5xl mx-auto px-4">
       {/* Header */}
        <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            DUKE OF LEATHER
          </h1>

          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
              />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </header>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.key}
              className="bg-white p-4 rounded-2xl shadow flex items-center gap-4"
            >
              <img
                src={item.images[0]?.src}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-xl">{item.name}</h2>
                <p className="text-red-700 font-bold">${Number(item?.prices.price) / 100}</p>

                <div className="flex items-center mt-2 gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.key, Number(e.target.value))
                    }
                    className="w-20 border rounded-md px-2 py-1"
                  />

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Total */}
        <div className="mt-10 text-right">
          <h2 className="text-2xl font-bold">
            Total: ${Number(cart?.totals?.total_price) / 100}
          </h2>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-4 px-6 py-3 bg-red-700 text-white rounded-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}