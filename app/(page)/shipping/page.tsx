import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns — GG Shop',
  description:
    'Learn about GG Shop shipping options, estimated delivery times, and our hassle-free return policy.',
};

const sections = [
  {
    title: 'Domestic Shipping (Nepal)',
    items: [
      { label: 'Standard Delivery', value: '3–5 business days' },
      { label: 'Express Delivery', value: '1–2 business days' },
      { label: 'Free Shipping', value: 'On orders over $50 / NPR 6,500' },
      { label: 'Same-Day Delivery', value: 'Available in Pokhara (order before 12 PM)' },
    ],
  },
  {
    title: 'International Shipping',
    items: [
      { label: 'Standard International', value: '7–14 business days' },
      { label: 'Express International', value: '3–5 business days' },
      { label: 'Shipping Cost', value: 'Calculated at checkout based on destination' },
      { label: 'Customs & Duties', value: 'Recipient is responsible for any import duties' },
    ],
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            Shipping & Returns
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">
            Everything you need to know about delivery and returns
          </p>
        </div>

        {/* Shipping Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-white border border-gray-100 shadow-sm p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6">
                {section.title}
              </h2>
              <div className="divide-y divide-gray-100">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between py-3 gap-4">
                    <span className="text-[11px] uppercase tracking-widest text-gray-500">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900 text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Returns Policy */}
          <div className="bg-white border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6">
              Return Policy
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                We want you to love every product you receive. If you're not completely satisfied,
                we accept returns within <strong className="text-gray-900">14 days</strong> of delivery.
              </p>
              <p>
                Items must be <strong className="text-gray-900">unused, unopened, and in original packaging</strong> to
                qualify for a return. For hygiene reasons, opened cosmetics cannot be returned unless
                they are defective or damaged.
              </p>
              <p>
                To initiate a return, email us at{' '}
                <a href="mailto:support@ggcosmetics.com" className="text-gray-900 underline">
                  support@ggcosmetics.com
                </a>{' '}
                with your order number and reason for return. We'll respond within 1–2 business days.
              </p>
              <p>
                Refunds are processed within <strong className="text-gray-900">5–7 business days</strong> after
                we receive the returned item. Shipping costs are non-refundable unless the return is
                due to our error.
              </p>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              Order Tracking
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Once your order ships, you'll receive a confirmation email with a tracking number.
              Use this number on our carrier's website to track your package in real time.
              If you haven't received a tracking email within 2 business days of placing your order,
              please contact us.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
