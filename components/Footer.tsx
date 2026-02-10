'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-16 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid gap-12 grid-cols-2 md:grid-cols-4">
        
        {/* Brand Section */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">GG COSMETICS</h2>
          <p className="text-sm text-gray-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
            Clean formulas. High performance. Consciously crafted in Pokhara.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white">Shop</h3>
          <ul className="space-y-4 text-sm uppercase tracking-widest text-gray-400">
            <li><Link href="/products" className="hover:text-white transition duration-200">New Arrivals</Link></li>
            <li><Link href="/products?category=lips" className="hover:text-white transition duration-200">Lips</Link></li>
            <li><Link href="/products?category=face" className="hover:text-white transition duration-200">Face</Link></li>
            <li><Link href="/products?category=skin" className="hover:text-white transition duration-200">Skincare</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white">Support</h3>
          <ul className="space-y-4 text-sm uppercase tracking-widest text-gray-400">
            <li><Link href="/contact" className="hover:text-white transition duration-200">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition duration-200">Shipping & Returns</Link></li>
            <li><Link href="/ingredients" className="hover:text-white transition duration-200">Ingredients</Link></li>
            <li><Link href="/faq" className="hover:text-white transition duration-200">Order Tracking</Link></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white">Follow Us</h3>
          <div className="flex space-x-6 text-xl text-gray-400 mb-8">
            <a href="#" className="hover:text-white transition duration-200" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="TikTok"><FaTiktok /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="YouTube"><FaYoutube /></a>
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-loose">
            support@ggcosmetics.com <br />
            Lakeside, Pokhara, Nepal
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-20 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} GG COSMETICS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;