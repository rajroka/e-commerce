import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — SportShop',
  description: 'How SportShop collects, uses, and protects your personal data.',
};

const sections = [
  {
    title: '1. Introduction',
    body: 'SportShop ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase. By using our services, you agree to the practices described in this policy.',
  },
  {
    title: '2. Information We Collect',
    items: [
      { label: 'Account Information', detail: 'Name, email address, and password (stored as a secure hash) when you register.' },
      { label: 'Order Information', detail: 'Billing/shipping address and payment details (processed by Stripe — we never store card numbers).' },
      { label: 'Usage Data', detail: 'Pages visited, time spent, and referring URLs collected automatically.' },
      { label: 'Communications', detail: 'Email address and message content if you contact us or subscribe to our newsletter.' },
    ],
  },
  {
    title: '3. How We Use Your Information',
    list: [
      'Process and fulfill your orders',
      'Send order confirmations and shipping updates',
      'Respond to inquiries and provide customer support',
      'Send promotional emails (only with your consent)',
      'Improve our website and product offerings',
      'Detect and prevent fraud or unauthorized access',
    ],
  },
  {
    title: '4. Data Sharing',
    body: "We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who help us operate our website and process orders (Stripe for payments, Cloudinary for image hosting, shipping carriers). These providers are contractually obligated to keep your information confidential.",
  },
  {
    title: '5. Cookies',
    body: 'We use cookies to maintain your session, remember your cart, and analyze traffic. You can control cookie settings through your browser; disabling cookies may affect some site functionality.',
  },
  {
    title: '6. Your Rights',
    list: [
      'Access the personal data we hold about you',
      'Request correction of inaccurate data',
      'Request deletion of your account and associated data',
      'Opt out of marketing communications at any time',
      'Lodge a complaint with a data protection authority',
    ],
    footer: 'To exercise any of these rights, email support@sportshop.com.',
  },
  {
    title: '7. Data Security',
    body: 'We implement SSL encryption, secure password hashing, and access controls to protect your information. No method of internet transmission is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update this policy from time to time. Material changes will be posted here with an updated date. Continued use of our services constitutes acceptance of the updated policy.',
  },
  {
    title: '9. Contact',
    body: null,
    contact: true,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">

        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 2025</p>
        </div>

        <div className="card divide-y divide-gray-50">
          {sections.map(s => (
            <div key={s.title} className="px-6 sm:px-8 py-7">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{s.title}</h2>

              {s.body && (
                <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
              )}

              {s.items && (
                <div className="space-y-3">
                  {s.items.map(item => (
                    <p key={item.label} className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-gray-900">{item.label}:</strong> {item.detail}
                    </p>
                  ))}
                </div>
              )}

              {s.list && (
                <ul className="text-sm text-gray-600 leading-relaxed space-y-1.5 list-disc list-inside">
                  {s.list.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}

              {s.footer && (
                <p className="text-sm text-gray-600 mt-3">{s.footer}</p>
              )}

              {s.contact && (
                <p className="text-sm text-gray-600">
                  Questions about this policy? Email{' '}
                  <a href="mailto:support@sportshop.com" className="text-red-500 hover:underline">
                    support@sportshop.com
                  </a>{' '}
                  or visit our{' '}
                  <Link href="/contact" className="text-red-500 hover:underline">Contact page</Link>.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
