import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — GG Shop',
  description:
    'Frequently asked questions about GG Shop products, orders, shipping, and returns.',
};

const faqs = [
  {
    question: 'Are your products cruelty-free?',
    answer:
      'Yes. All GG Cosmetics products are 100% cruelty-free. We never test on animals and do not work with suppliers who do. We are committed to ethical beauty practices at every stage of production.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order has shipped, you will receive a confirmation email containing your tracking number. You can use this number on the carrier\'s website to monitor your delivery in real time. If you haven\'t received a tracking email within 2 business days, please contact our support team.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'We accept returns within 14 days of delivery for unused, unopened items in their original packaging. For hygiene reasons, opened cosmetics cannot be returned unless they are defective or damaged. To start a return, email support@ggcosmetics.com with your order number.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as payments via Stripe. All transactions are secured with SSL encryption. We do not store your card details on our servers.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Domestic orders within Nepal typically arrive in 3–5 business days for standard shipping, or 1–2 business days for express. International orders take 7–14 business days for standard shipping. Free shipping is available on all orders over $50.',
  },
  {
    question: 'Do you offer wholesale or bulk pricing?',
    answer:
      'Yes, we offer wholesale pricing for salons, spas, and retailers. Please reach out to us at support@ggcosmetics.com with your business details and the products you\'re interested in, and our team will get back to you within 2 business days.',
  },
  {
    question: 'Are your products suitable for sensitive skin?',
    answer:
      'Many of our products are formulated with sensitive skin in mind, using clean, dermatologist-tested ingredients. Each product page lists the full ingredient list. If you have specific allergies or skin conditions, we recommend consulting a dermatologist before use.',
  },
  {
    question: 'How do I create an account?',
    answer:
      'Click "Sign Up" in the navigation bar and fill in your name, email, and a password. You can also sign up instantly using your Google account. Having an account lets you track orders, save your cart across devices, and access exclusive offers.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">
            Quick answers to common questions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white border border-gray-100 shadow-sm"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                <span className="text-sm font-bold uppercase tracking-tight text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="text-gray-400 group-open:rotate-45 transition-transform duration-200 shrink-0 text-xl font-light">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-white border border-gray-100 shadow-sm p-8 text-center">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Our team is happy to help. Reach out and we'll respond within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gray-800 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
