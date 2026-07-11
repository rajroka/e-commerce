import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — GG Shop',
  description: 'Learn about GG Shop — our mission, values, and the team behind the products.',
};

const values = [
  { icon: '🤝', title: 'Customer First',       desc: "Every decision starts with what's best for our customers." },
  { icon: '💡', title: 'Innovation Driven',     desc: 'We constantly look for smarter, better ways to do things.' },
  { icon: '✅', title: 'Quality Obsessed',      desc: 'We never compromise on the quality of our products.' },
  { icon: '🔍', title: 'Trust & Transparency',  desc: 'Honest communication builds lasting relationships.' },
  { icon: '📈', title: 'Continuous Growth',     desc: 'We learn, iterate, and improve every single day.' },
  { icon: '🌱', title: 'Sustainability',         desc: "We're committed to reducing our environmental footprint." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            We're building the future of online shopping
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            GG Shop is on a mission to make premium products accessible, with outstanding service
            and an unwavering commitment to quality.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Delivering value through quality and trust
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is simple — to deliver value through innovative products, outstanding
              customer service, and an unwavering commitment to quality. We believe in creating
              long-term relationships with customers, built on trust and satisfaction.
            </p>
            <Link href="/products" className="btn-primary mt-6">Shop Now</Link>
          </div>
          <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image src="/66.png" alt="Our mission" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our core values</h2>
            <p className="text-sm text-gray-500">What guides every decision we make</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {values.map(v => (
              <div key={v.title} className="card p-5 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">{v.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to shop?</h2>
        <p className="text-sm text-gray-500 mb-6">Explore thousands of products from trusted sellers.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/products" className="btn-primary">Browse Products</Link>
          <Link href="/contact"  className="btn-ghost">Get in Touch</Link>
        </div>
      </section>
    </main>
  );
}
