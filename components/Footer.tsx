'use client';

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { InstagramIcon, YoutubeIcon, TwitchIcon } from '@hugeicons/core-free-icons';

const Footer = () => (
  <footer className="bg-gray-900 text-white px-6 py-16 md:px-16 lg:px-24">
    <div className="max-w-7xl mx-auto grid gap-12 grid-cols-2 md:grid-cols-4">

      <div className="col-span-2 md:col-span-1">
        <h2 className="text-lg font-bold mb-4 text-white">GG Shop</h2>
        <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
          Quality products delivered to your door. Trusted by thousands worldwide.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-5 text-white">Shop</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          {[
            { href: '/products',              label: 'New Arrivals' },
            { href: '/products?category=lips', label: 'Lips' },
            { href: '/products?category=face', label: 'Face' },
            { href: '/products?category=skin', label: 'Skincare' },
          ].map(i => (
            <li key={i.href}><Link href={i.href} className="hover:text-white transition-colors duration-200">{i.label}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-5 text-white">Support</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          {[
            { href: '/contact',  label: 'Contact Us' },
            { href: '/shipping', label: 'Shipping & Returns' },
            { href: '/faq',      label: 'FAQ' },
            { href: '/privacy',  label: 'Privacy Policy' },
            { href: '/terms',    label: 'Terms of Service' },
          ].map(i => (
            <li key={i.href}><Link href={i.href} className="hover:text-white transition-colors duration-200">{i.label}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-5 text-white">Follow Us</h3>
        <div className="flex gap-4 mb-6">
          {[
            { icon: InstagramIcon, label: 'Instagram' },
            { icon: TwitchIcon,    label: 'TikTok' },
            { icon: YoutubeIcon,   label: 'YouTube' },
          ].map(({ icon, label }) => (
            <a key={label} href="#" aria-label={label}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-500 flex items-center justify-center transition-colors duration-200">
              <HugeiconsIcon icon={icon} size={16} color="white" strokeWidth={1.5} />
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500 leading-loose">
          support@ggshop.com<br />Lakeside, Pokhara, Nepal
        </p>
      </div>
    </div>

    <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-gray-500" suppressHydrationWarning>
        © {new Date().getFullYear()} GG Shop. All rights reserved.
      </p>
      <div className="flex gap-6 text-xs text-gray-500">
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
