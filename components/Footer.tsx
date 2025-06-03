import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10 md:px-12 lg:px-24">
      <div className="grid gap-10 md:grid-cols-3">
        {/* About/Brand Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">ShopEase</h2>
          <p className="text-sm text-gray-400">
            ShopEase is your go-to destination for top-quality electronics and gadgets at the best prices.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm text-gray-400">Email: support@shopease.com</p>
          <p className="text-sm text-gray-400">Phone: +1 234 567 8901</p>
          <p className="text-sm text-gray-400">Address: 123 Tech Street, Silicon Valley, CA</p>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-xl text-gray-300">
            <a href="#" className="hover:text-white">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
