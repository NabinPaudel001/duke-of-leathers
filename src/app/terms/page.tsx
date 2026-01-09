"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {FaCircle, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function TermsAndConditionsPage() {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-[#fafafa]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white bg-[url('/images/s.webp')] bg-cover bg-center shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.svg" alt="Bull logo" width={30} height={30} />
            <Image
              src="/duke-logo.svg"
              alt="Duke logo"
              width={80}
              height={42}
              className="ml-1 mt-1"
              priority
            />
          </div>

          <button
            onClick={() => router.push("/")}
            className="text-white text-sm font-medium hover:underline"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-24 space-y-16 text-gray-700">

        {/* PAGE HEADER */}
        <section className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 text-base">
            These terms govern purchases made from DUKE OF KHATRI LEATHERS. 
            Please read them carefully before placing an order.
          </p>
        </section>

        {/* TERMS SECTIONS */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 ">General</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            By placing an order on our website, you agree to these Terms & Conditions. 
            The agreement becomes legally binding once your order has been confirmed.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Prices & Payment</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            All prices are displayed in <strong>NOK</strong> and include applicable taxes unless otherwise stated. 
            We offer secure payment options, including <strong>Klarna</strong>, where available.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Order Confirmation</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            After completing your purchase, you will receive an order confirmation by email. 
            Please review it carefully and contact us immediately if any information is incorrect.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Delivery</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Orders are shipped to the address provided during checkout. Delivery times may vary depending on destination and shipping provider.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Risk & Ownership</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Risk transfers to the customer once the product has been delivered. Ownership transfers only after full payment has been received.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Complaints & Defects</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            If an item is defective or damaged upon arrival, please contact us promptly so we can resolve the matter according to applicable consumer protection laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Right of Withdrawal (Returns)</h2>
          <p className="text-gray-600 leading-relaxed">
            You have the right to withdraw from your purchase within <strong>14 days</strong> of receiving your order.
          </p>

          {/* BULLETS */}
           <div className="space-y-3 ml-3">
        {[
          "The product must be unused and in its original condition.",
          "The original packaging must be included.",
          "Valid proof of purchase is required."
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-3 ml-3">
            <FaCircle className="text-amber-500 mt-2 flex-shrink-0" size={8} />
            <p className="text-gray-600">{item}</p>
          </div>
        ))}
      </div>

          <h3 className="text-gray-800 font-medium mt-4">How to Exercise Your Right of Withdrawal</h3>
          <p className="text-gray-600 leading-relaxed mb-2">
            Notify us within 14 days of receiving the product. The item must be returned within a reasonable time.
          </p>

          <h3 className="text-gray-800 font-medium mt-4">Refunds</h3>
          <p className="text-gray-600 leading-relaxed mb-2">
            Once returned items are received and inspected, refunds will be issued using the original payment method. 
            Shipping costs are non-refundable unless the return is due to our error.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Shipping Information</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            Orders are typically processed within <strong>1–3 business days</strong>. Delivery usually takes <strong>3–7 business days</strong>, depending on destination.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            DUKE OF KHATRI LEATHERS shall not be held liable for delays or failures caused by circumstances beyond our control, 
            including carrier delays or force majeure events.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900">Customer Support</h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            For any questions regarding orders, shipping, or returns, please contact us using the information provided on our website.
          </p>
        </section>

      </main>

      {/* FOOTER */}
    <footer className="bg-black text-white py-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">

          {/* Left */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4 gap-0">
              <Image src="/logo.svg" alt="Bull logo" width={60} height={64} priority />
              <Image src="/duke-logo.svg" alt="Duke logo" width={240} height={64} priority />
            </div>

            <p className="text-sm">
              &copy; {new Date().getFullYear()} Duke of Leather. All rights reserved.
            </p>

            {/* TERMS BUTTON */}
            <button className="text-sm mt-2 underline hover:text-amber-400 transition"
            >
              <a href="/terms" target="_blank">Terms & Conditions</a>
            </button>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-sm">
              <p>Email: <a href="mailto:leathers.duke@gmail.com">leathers.duke@gmail.com</a></p>
              <p>Phone: <a href="tel:+4745423709">+47 45423709</a></p>
              <p>
                Address: Fredrik Borgens veg 31,<br />
                <span className="md:ml-[64px]">2040 Kløfta Norway</span>
              </p>
            </div>

            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1CiUKWfDH9/"><FaFacebook size={20} /></a>
              <a href="https://www.instagram.com/dukeofleathers"><FaInstagram size={20} /></a>
              <a href="https://www.tiktok.com/@duke.of.leathers"><FaTiktok size={20} /></a>
            </div>
          </div>
        </div>
      </footer>

    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-black text-white py-14">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">

        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <Image src="/logo.svg" alt="Bull logo" width={60} height={64} />
            <Image src="/duke-logo.svg" alt="Duke logo" width={240} height={64} />
          </div>

          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Duke of Leather. All rights reserved.
          </p>

          <a
            href="/terms"
            target="_blank"
            className="inline-block mt-3 text-sm underline hover:text-amber-400 transition"
          >
            Terms & Conditions
          </a>
        </div>

        <div className="text-sm text-center md:text-right space-y-4">
          <div>
            <p>Email: <a href="mailto:leathers.duke@gmail.com">leathers.duke@gmail.com</a></p>
            <p>Phone: <a href="tel:+4745423709">+47 45423709</a></p>
            <p>
              Fredrik Borgens veg 31<br />
              2040 Kløfta, Norway
            </p>
          </div>

          <div className="flex justify-center md:justify-end gap-5">
            <a href="https://www.facebook.com/share/1CiUKWfDH9/"><FaFacebook size={18} /></a>
            <a href="https://www.instagram.com/dukeofleathers"><FaInstagram size={18} /></a>
            <a href="https://www.tiktok.com/@duke.of.leathers"><FaTiktok size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
