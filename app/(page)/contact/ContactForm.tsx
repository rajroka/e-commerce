'use client';

import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
  }

  if (submitted) {
    return (
      <div className="bg-white border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <FiMail className="text-green-500 text-2xl" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">
          Message Sent
        </h2>
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black underline transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label
            htmlFor="contact-name"
            className="block text-[11px] font-bold uppercase tracking-widest text-gray-500"
          >
            Full Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            className="w-full px-3 py-3 border border-gray-300 rounded bg-transparent text-sm placeholder-gray-400 focus:border-black outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-email"
            className="block text-[11px] font-bold uppercase tracking-widest text-gray-500"
          >
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className="w-full px-3 py-3 border border-gray-300 rounded bg-transparent text-sm placeholder-gray-400 focus:border-black outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-message"
            className="block text-[11px] font-bold uppercase tracking-widest text-gray-500"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="How can we help you?"
            required
            className="w-full px-3 py-3 border border-gray-300 rounded bg-transparent text-sm placeholder-gray-400 focus:border-black outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gray-800 hover:bg-black text-white text-sm font-bold uppercase tracking-[0.2em] transition-all rounded disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
