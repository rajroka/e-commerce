'use client';

import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SendingOrderIcon, CheckIcon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import toast from 'react-hot-toast';

const STROKE = 1.5;

export default function ContactForm() {
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll be in touch soon.");
  }

  if (submitted) return (
    <div className="card p-10 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
        <HugeiconsIcon icon={CheckIcon} size={24} color="#22c55e" strokeWidth={STROKE} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Message sent!</h2>
        <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
      </div>
      <button onClick={() => setSubmitted(false)} className="text-sm text-red-500 font-medium hover:underline">Send another message</button>
    </div>
  );

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Send us a message</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="c-name" className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
          <input id="c-name" name="name" type="text" required placeholder="Your name" className="input" />
        </div>
        <div>
          <label htmlFor="c-email" className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
          <input id="c-email" name="email" type="email" required placeholder="you@example.com" className="input" />
        </div>
        <div>
          <label htmlFor="c-subject" className="block text-xs font-medium text-gray-600 mb-1.5">Subject</label>
          <input id="c-subject" name="subject" type="text" placeholder="How can we help?" className="input" />
        </div>
        <div>
          <label htmlFor="c-message" className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
          <textarea id="c-message" name="message" rows={5} required placeholder="Tell us more…" className="input resize-none" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl">
          {loading
            ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />Sending…</>
            : <><HugeiconsIcon icon={SendingOrderIcon} size={15} color="white" strokeWidth={STROKE} />Send Message</>}
        </button>
      </form>
    </div>
  );
}
