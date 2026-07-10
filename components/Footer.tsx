'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-16 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid gap-12 grid-cols-2 md:grid-cols-4">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-xl font-bold mb-4 text-white">GG Shop</h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
            Clean formulas. High performance. Consciously crafted in Pokhara.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-sm font-semibold mb-6 text-white">Shop</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/products"              className="hover:text-white transition duration-200">New Arrivals</Link></li>
            <li><Link href="/products?category=lips" className="hover:text-white transition duration-200">Lips</Link></li>
            <li><Link href="/products?category=face" className="hover:text-white transition duration-200">Face</Link></li>
            <li><Link href="/products?category=skin" className="hover:text-white transition duration-200">Skincare</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold mb-6 text-white">Support</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/contact"  className="hover:text-white transition duration-200">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition duration-200">Shipping & Returns</Link></li>
            <li><Link href="/faq"      className="hover:text-white transition duration-200">FAQ</Link></li>
            <li><Link href="/privacy"  className="hover:text-white transition duration-200">Privacy Policy</Link></li>
            <li><Link href="/terms"    className="hover:text-white transition duration-200">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-semibold mb-6 text-white">Follow Us</h3>
          <div className="flex space-x-6 text-xl text-gray-400 mb-8">
            <a href="#" className="hover:text-white transition duration-200" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="TikTok"><FaTiktok /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="YouTube"><FaYoutube /></a>
          </div>
          <p className="text-xs text-gray-500 leading-loose">
            support@ggshop.com<br />
            Lakeside, Pokhara, Nepal
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-20 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500" suppressHydrationWarning>
          © {new Date().getFullYear()} GG Shop. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
