import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12 md:px-16 lg:px-24">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Brand/About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-3">GGShop</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your go-to destination in Pokhara for the latest in fashion, tech, and lifestyle. Quality products, unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/products" className="hover:text-white transition duration-200">Products</a></li>
            <li><a href="/about" className="hover:text-white transition duration-200">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition duration-200">Contact</a></li>
            <li><a href="/faq" className="hover:text-white transition duration-200">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">Email: <a href="mailto:support@ggshop.com" className="hover:text-white transition duration-200">support@ggshop.com</a></p>
          <p className="text-sm text-gray-400">Phone: <a href="tel:+9779800000000" className="hover:text-white transition duration-200">+977 9800000000</a></p>
          <p className="text-sm text-gray-400">Address: Lakeside, Pokhara, Nepal</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl text-gray-400">
            <a href="#" className="hover:text-white transition duration-200" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition duration-200" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-800 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GGShop. Made with ❤️ in Pokhara, Nepal.
      </div>
    </footer>
  );
};

export default Footer;
