import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us — GG Shop',
  description:
    'Get in touch with GG Shop. Send us a message, find our address, or reach us by phone.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">Contact Us</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form (client component) */}
          <ContactForm />

          {/* Store Info */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 shadow-sm p-8 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">
                Get in Touch
              </h2>

              <div className="flex items-start gap-4">
                <FiMapPin className="text-gray-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Address</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Lakeside, Pokhara<br />
                    Gandaki Province, Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMail className="text-gray-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Email</p>
                  <a
                    href="mailto:support@ggcosmetics.com"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors mt-1 block"
                  >
                    support@ggcosmetics.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiPhone className="text-gray-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Phone</p>
                  <a
                    href="tel:+977-61-123456"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors mt-1 block"
                  >
                    +977-61-123456
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
                Business Hours
              </h2>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest text-[11px]">Sunday – Friday</span>
                  <span className="font-bold text-gray-900 text-[11px]">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest text-[11px]">Saturday</span>
                  <span className="font-bold text-gray-900 text-[11px]">10:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
