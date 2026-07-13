import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — SportShop',
  description: 'SportShop terms of service covering purchase terms, refund policy, and acceptable use.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using SportShop, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. We reserve the right to update these terms at any time; continued use constitutes acceptance.',
  },
  {
    title: '2. Purchase Terms',
    paras: [
      'All prices are in USD and subject to change without notice. We reserve the right to refuse or cancel orders we deem fraudulent or that exceed reasonable quantities.',
      "By placing an order, you confirm you are at least 18 years old and that all information provided is accurate. Payment is processed securely through Stripe at time of purchase.",
      "We make every effort to display product colors accurately, but cannot guarantee your device's display reflects the actual product.",
    ],
  },
  {
    title: '3. Refund Policy',
    paras: [
      'We offer refunds on unused, unopened items returned within 14 days of delivery. To request a refund, email support@sportshop.com with your order number.',
      'Refunds are issued to the original payment method within 5–7 business days of receiving the return. Shipping costs are non-refundable unless the return is due to our error.',
      'For hygiene and safety reasons, opened cosmetics and personal care products cannot be returned unless defective or damaged on arrival.',
    ],
  },
  {
    title: '4. Acceptable Use',
    intro: 'You agree not to:',
    list: [
      'Violate any applicable laws or regulations',
      'Engage in fraudulent transactions or impersonate others',
      'Attempt to gain unauthorized access to our systems',
      'Transmit harmful, offensive, or spam content',
      'Scrape or harvest data from our website without permission',
      'Resell products without prior written consent',
    ],
  },
  {
    title: '5. Intellectual Property',
    body: 'All content on this website — text, images, logos, and product descriptions — is the property of SportShop and protected by copyright law. You may not reproduce, distribute, or create derivative works without express written permission.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'To the maximum extent permitted by law, GG Shop shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability for any claim shall not exceed the amount you paid for the product in question.',
  },
  {
    title: '7. Governing Law',
    body: 'These Terms are governed by the laws of Nepal. Disputes shall be resolved in the courts of Gandaki Province.',
  },
  {
    title: '8. Contact',
    contact: true,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">

        <div className="page-header">
          <h1>Terms of Service</h1>
          <p>Last updated: January 2025</p>
        </div>

        <div className="card divide-y divide-gray-50">
          {sections.map(s => (
            <div key={s.title} className="px-6 sm:px-8 py-7">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{s.title}</h2>

              {s.body && <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>}

              {s.paras && (
                <div className="space-y-3">
                  {s.paras.map((p, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              )}

              {s.intro && (
                <p className="text-sm text-gray-600 mb-2">{s.intro}</p>
              )}

              {s.list && (
                <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  {s.list.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}

              {s.contact && (
                <p className="text-sm text-gray-600">
                  Questions? Email{' '}
                  <a href="mailto:support@sportshop.com" className="text-red-500 hover:underline">
                    support@sportshop.com
                  </a>.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
