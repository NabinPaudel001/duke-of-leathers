"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      alert("Failed to send message. Try again later.");
    }
  };

  return (
    <section id="contact" className="max-w-4xl mx-auto mb-0">
      <div className="mx-4 bg-white p-10 rounded-3xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Have a question or want to work with us? Send us a message below.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white font-semibold py-4 rounded-xl hover:bg-red-800 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
