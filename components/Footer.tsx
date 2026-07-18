'use client';

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { InstagramIcon, YoutubeIcon, Facebook01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 grid gap-12 grid-cols-2 md:grid-cols-4">

      {/* Brand */}
      <div className="col-span-2 md:col-span-1">
        <Link href="/">
          <img src="/m.png" alt="SportShop" className="h-10 w-auto mb-4" />
        </Link>
        <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
          Premium sports gear and equipment delivered to your door. Trusted by athletes worldwide.
        </p>
      </div>

      {/* Shop */}
      <div>
        <h3 className="text-sm font-semibold mb-5 text-white">Shop</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          {[
            { href: '/products',                       label: 'All Products' },
            { href: '/products?category=footwear',     label: 'Footwear' },
            { href: '/products?category=apparel',      label: 'Apparel' },
            { href: '/products?category=gym-fitness',  label: 'Gym & Fitness' },
            { href: '/products?category=accessories',  label: 'Accessories' },
          ].map(i => (
            <li key={i.href}>
              <Link href={i.href} className="hover:text-white transition-colors duration-200">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Account & info */}
      <div>
        <h3 className="text-sm font-semibold mb-5 text-white">Account</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          {[
            { href: '/profile',              label: 'My Profile' },
            { href: '/profile?tab=orders',   label: 'My Orders' },
            { href: '/cart',                 label: 'Cart' },
            { href: '/wishlist',             label: 'Wishlist' },
          ].map(i => (
            <li key={i.href}>
              <Link href={i.href} className="hover:text-white transition-colors duration-200">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support & social */}
      <div>
        <h3 className="text-sm font-semibold mb-5 text-white">Support</h3>
        <ul className="space-y-3 text-sm text-gray-400 mb-8">
          {[
            { href: '/contact',  label: 'Contact Us' },
            { href: '/faq',      label: 'FAQ' },
            { href: '/shipping', label: 'Shipping & Returns' },
            { href: '/about',    label: 'About Us' },
          ].map(i => (
            <li key={i.href}>
              <Link href={i.href} className="hover:text-white transition-colors duration-200">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          {[
            { icon: InstagramIcon, label: 'Instagram', href: '#' },
            { icon: Facebook01Icon, label: 'Facebook',  href: '#' },
            { icon: YoutubeIcon,   label: 'YouTube',    href: '#' },
          ].map(({ icon, label, href }) => (
            <a key={label} href={href} aria-label={label}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-red-500 flex items-center justify-center transition-colors duration-200">
              <HugeiconsIcon icon={icon} size={16} color="white" strokeWidth={STROKE} />
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="mt-16 border-t border-gray-800 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-gray-500" suppressHydrationWarning>
        © {new Date().getFullYear()} SportShop. All rights reserved.
      </p>
      <div className="flex gap-6 text-xs text-gray-500">
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
      </div>
      </div>
    </div>
  </footer>
);

export default Footer;


