'use client';

import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon, CheckIcon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

export default function Newsletter() {
  const [email,   setEmail]   = useState('');
  const [agreed,  setAgreed]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreed)              { setError('Please agree to the privacy policy.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  };

  return (
    <section className="w-full bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="max-w-lg mx-auto text-center">

        <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-5">
          <HugeiconsIcon icon={Mail01Icon} size={20} color="#ef4444" strokeWidth={STROKE} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Stay in the loop</h2>
        <p className="text-sm text-gray-500 mb-8">
          New arrivals, exclusive deals, and curated picks — straight to your inbox.
        </p>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full border border-green-200 flex items-center justify-center">
              <HugeiconsIcon icon={CheckIcon} size={22} color="#22c55e" strokeWidth={STROKE} />
            </div>
            <p className="text-sm font-semibold text-gray-900">You're on the list!</p>
            <p className="text-xs text-gray-400">We'll be in touch with the good stuff.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address" required
                className={`input flex-1 ${error ? 'border-red-400' : ''}`} />
              <button type="submit" disabled={loading}
                className="btn-primary px-5 rounded-xl flex-shrink-0 gap-1.5">
                {loading
                  ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={16} color="white" strokeWidth={STROKE} className="animate-spin" />
                  : 'Subscribe'}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 text-left">{error}</p>}
            <label className="flex items-start gap-2.5 cursor-pointer text-left">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-red-500 cursor-pointer flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to receive marketing emails. I can unsubscribe at any time. View our{' '}
                <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>.
              </span>
            </label>
          </form>
        )}
      </div>
      </div>
    </section>
  );
}


