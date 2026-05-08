import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — GG Shop',
  description:
    'Read the GG Shop privacy policy to understand how we collect, use, and protect your personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">
            Last updated: January 2025
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 space-y-10">
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              GG Cosmetics ("we", "us", or "our") is committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your data when
              you visit our website or make a purchase. By using our services, you agree to the
              practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p><strong className="text-gray-900">Account Information:</strong> When you create an account, we collect your name, email address, and password (stored as a secure hash).</p>
              <p><strong className="text-gray-900">Order Information:</strong> When you place an order, we collect your billing address, shipping address, and payment details (processed securely by Stripe — we never store card numbers).</p>
              <p><strong className="text-gray-900">Usage Data:</strong> We automatically collect information about how you interact with our website, including pages visited, time spent, and referring URLs.</p>
              <p><strong className="text-gray-900">Communications:</strong> If you contact us or subscribe to our newsletter, we store your email address and message content.</p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmations and shipping updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send promotional emails (only with your consent)</li>
              <li>To improve our website and product offerings</li>
              <li>To detect and prevent fraud or unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              4. Data Sharing
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your data with trusted service providers who assist us in operating our website and
              processing orders (such as Stripe for payments, Cloudinary for image hosting, and
              shipping carriers). These providers are contractually obligated to keep your information
              confidential and use it only for the services they provide to us.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              5. Cookies
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to maintain your session, remember your
              cart, and analyze website traffic. You can control cookie settings through your browser.
              Disabling cookies may affect some functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:support@ggcosmetics.com" className="text-gray-900 underline">
                  support@ggcosmetics.com
                </a>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              7. Data Security
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We implement industry-standard security measures including SSL encryption, secure
              password hashing, and access controls to protect your personal information. However,
              no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by posting the new policy on this page with an updated date. Continued use of
              our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              9. Contact
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@ggcosmetics.com" className="text-gray-900 underline">
                support@ggcosmetics.com
              </a>{' '}
              or visit our{' '}
              <a href="/contact" className="text-gray-900 underline">
                Contact page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
