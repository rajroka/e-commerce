import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — GG Shop',
  description:
    'Read the GG Shop terms of service covering purchase terms, refund policy, and acceptable use.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">
            Last updated: January 2025
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 space-y-10">
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              By accessing or using the GG Shop website and services, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
              We reserve the right to update these terms at any time, and your continued use of the
              site constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              2. Purchase Terms
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                All prices are listed in USD and are subject to change without notice. We reserve the
                right to refuse or cancel any order at our discretion, including orders that appear
                fraudulent or that exceed reasonable purchase quantities.
              </p>
              <p>
                By placing an order, you represent that you are at least 18 years of age and that the
                information you provide is accurate and complete. Payment is processed securely through
                Stripe at the time of purchase.
              </p>
              <p>
                We make every effort to display product colors and descriptions accurately, but we
                cannot guarantee that your device's display will accurately reflect the actual product.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              3. Refund Policy
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                We offer refunds on unused, unopened items returned within 14 days of delivery.
                To request a refund, contact us at{' '}
                <a href="mailto:support@ggcosmetics.com" className="text-gray-900 underline">
                  support@ggcosmetics.com
                </a>{' '}
                with your order number.
              </p>
              <p>
                Refunds are issued to the original payment method within 5–7 business days of
                receiving the returned item. Shipping costs are non-refundable unless the return
                is due to our error (wrong item, defective product).
              </p>
              <p>
                For hygiene and safety reasons, opened cosmetics, skincare, and personal care
                products cannot be returned unless they are defective or damaged upon arrival.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              You agree not to use our website or services to:
            </p>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>Violate any applicable laws or regulations</li>
              <li>Engage in fraudulent transactions or impersonate others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit harmful, offensive, or spam content</li>
              <li>Scrape, crawl, or harvest data from our website without permission</li>
              <li>Resell products purchased from us without prior written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              All content on this website — including text, images, logos, and product descriptions —
              is the property of GG Cosmetics and is protected by copyright law. You may not
              reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, GG Cosmetics shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of our
              products or services. Our total liability for any claim shall not exceed the amount
              you paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              7. Governing Law
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              These Terms of Service are governed by the laws of Nepal. Any disputes arising from
              these terms shall be resolved in the courts of Gandaki Province, Nepal.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
              8. Contact
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:support@ggcosmetics.com" className="text-gray-900 underline">
                support@ggcosmetics.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
