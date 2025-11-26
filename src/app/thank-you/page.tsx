"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <section className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been received and is being processed. You will receive a confirmation email shortly.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/products"
              className="block bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => router.push("/")}
              className="text-red-700 hover:text-red-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}