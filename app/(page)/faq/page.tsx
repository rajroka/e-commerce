import type { Metadata } from 'next';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { CustomerSupportIcon } from '@hugeicons/core-free-icons';

export const metadata: Metadata = {
  title: 'FAQ — SportShop',
  description: 'Frequently asked questions about SportShop products, orders, shipping, and returns.',
};

const faqs = [
  { q: 'What sports gear do you carry?', a: 'We stock a wide range of sports equipment and apparel including footwear, gym fitness gear, running, cycling, basketball, football and more.' },
  { q: 'How do I track my order?', a: "Once your order ships, you'll receive a confirmation email with a tracking number to monitor delivery in real time." },
  { q: 'Can I return or exchange a product?', a: 'We accept returns within 14 days of delivery for unused, unopened items. Email support@sportshop.com with your order number to start a return.' },
  { q: 'What payment methods do you accept?', a: 'All major credit and debit cards via Stripe. All transactions are SSL-encrypted. We never store card details.' },
  { q: 'How long does shipping take?', a: 'Domestic orders: 3–5 business days standard, 1–2 express. International: 7–14 business days. Free shipping over $50.' },
  { q: 'Do you offer wholesale or bulk pricing?', a: 'Yes. Email support@sportshop.com with your business details and our team will respond within 2 business days.' },
  { q: 'Are your products genuine?', a: 'Yes. All products are 100% authentic and sourced directly from verified suppliers and brands.' },
  { q: 'How do I create an account?', a: 'Click "Sign Up" in the nav bar and enter your name, email, and password — or sign up instantly with Google.' },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="page-header">
          <h1>Frequently Asked Questions</h1>
          <p>Quick answers to common questions</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details key={i} className="card group">
              <summary className="flex items-center justify-between px-5 py-4 select-none">
                <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                <span className="text-gray-400 flex-shrink-0 text-lg leading-none transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="card mt-8 p-8 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon icon={CustomerSupportIcon} size={22} color="#ef4444" strokeWidth={1.5} />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-sm text-gray-500 mb-5">Our team replies within 24 hours.</p>
          <Link href="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
