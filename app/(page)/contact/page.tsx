import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Contact Us — SportShop',
  description: 'Get in touch with SportShop. Send us a message, find our address, or reach us by phone.',
};

const details = [
  {
    icon: <FiMapPin size={18} className="text-red-500 flex-shrink-0 mt-0.5" />,
    label: 'Address',
    value: 'Lakeside, Pokhara\nGandaki Province, Nepal',
  },
  {
    icon: <FiMail size={18} className="text-red-500 flex-shrink-0 mt-0.5" />,
    label: 'Email',
    value: 'support@sportshop.com',
    href: 'mailto:support@sportshop.com',
  },
  {
    icon: <FiPhone size={18} className="text-red-500 flex-shrink-0 mt-0.5" />,
    label: 'Phone',
    value: '+977-61-123456',
    href: 'tel:+97761123456',
  },
];

const hours = [
  { days: 'Sunday – Friday', time: '9:00 AM – 6:00 PM' },
  { days: 'Saturday',        time: '10:00 AM – 4:00 PM' },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="page-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Fill in the form or reach out directly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />

          <div className="space-y-5">
            {/* Contact details */}
            <div className="card p-6 sm:p-8 space-y-5">
              <h2 className="text-base font-semibold text-gray-900">Get in touch</h2>
              {details.map(d => (
                <div key={d.label} className="flex items-start gap-4">
                  {d.icon}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="text-sm text-gray-700 hover:text-red-500 transition-colors whitespace-pre-line">
                        {d.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-line">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business hours */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <FiClock size={16} className="text-red-500" />
                <h2 className="text-base font-semibold text-gray-900">Business hours</h2>
              </div>
              <div className="space-y-3">
                {hours.map(h => (
                  <div key={h.days} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{h.days}</span>
                    <span className="font-medium text-gray-900">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
