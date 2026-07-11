import type { Metadata } from 'next';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { TruckDeliveryIcon, GlobeIcon, Refresh01Icon, MapPinIcon } from '@hugeicons/core-free-icons';

export const metadata: Metadata = {
  title: 'Shipping & Returns — GG Shop',
  description: 'GG Shop shipping options, delivery times, and return policy.',
};

const STROKE = 1.5;

const sections = [
  {
    icon: <HugeiconsIcon icon={TruckDeliveryIcon} size={18} color="#ef4444" strokeWidth={STROKE} />,
    title: 'Domestic Shipping (Nepal)',
    rows: [
      { label: 'Standard delivery',  value: '3–5 business days' },
      { label: 'Express delivery',   value: '1–2 business days' },
      { label: 'Free shipping',      value: 'Orders over $50 / NPR 6,500' },
      { label: 'Same-day delivery',  value: 'Pokhara only (order before 12 PM)' },
    ],
  },
  {
    icon: <HugeiconsIcon icon={GlobeIcon} size={18} color="#ef4444" strokeWidth={STROKE} />,
    title: 'International Shipping',
    rows: [
      { label: 'Standard international', value: '7–14 business days' },
      { label: 'Express international',  value: '3–5 business days' },
      { label: 'Shipping cost',          value: 'Calculated at checkout' },
      { label: 'Customs & duties',       value: 'Recipient responsibility' },
    ],
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="page-header">
          <h1>Shipping &amp; Returns</h1>
          <p>Everything you need to know about delivery and returns</p>
        </div>

        {sections.map(s => (
          <div key={s.title} className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">{s.icon}<h2 className="text-base font-semibold text-gray-900">{s.title}</h2></div>
            <div className="divide-y divide-gray-50">
              {s.rows.map(r => (
                <div key={r.label} className="flex justify-between py-3 gap-4 text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="font-medium text-gray-900 text-right">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <HugeiconsIcon icon={Refresh01Icon} size={18} color="#ef4444" strokeWidth={STROKE} />
            <h2 className="text-base font-semibold text-gray-900">Return Policy</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>Returns accepted within <strong className="text-gray-900">14 days</strong> of delivery for unused, unopened items in original packaging.</p>
            <p>Opened products cannot be returned unless defective or damaged.</p>
            <p>Email <a href="mailto:support@ggshop.com" className="text-red-500 hover:underline">support@ggshop.com</a> with your order number to initiate a return.</p>
            <p>Refunds processed within <strong className="text-gray-900">5–7 business days</strong>. Shipping costs are non-refundable unless our error.</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={MapPinIcon} size={18} color="#ef4444" strokeWidth={STROKE} />
            <h2 className="text-base font-semibold text-gray-900">Order Tracking</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">Once your order ships, you'll receive an email with your tracking number. Haven't received it within 2 business days? Contact us.</p>
          <Link href="/contact" className="btn-ghost text-sm">Contact support</Link>
        </div>
      </div>
    </main>
  );
}
