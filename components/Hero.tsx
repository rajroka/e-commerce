'use client';

import Image from "next/image";
import Link from "next/link";

const SplitHero = () => {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[auto] flex flex-col md:flex-row">
      {/* Left Content Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-lg mx-auto space-y-6">
          <span className="inline-block px-4 py-2 border text-black border-solid rounded-full text-sm font-medium">
            New Collection
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
            Summer Essentials <br className="hidden sm:block" /> 2026
          </h1>
          
          <p className="text-lg text-gray-600">
            Discover our curated selection of premium quality apparel designed for comfort and style
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/products">
              <button className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors">
                Shop Now
              </button>
            </Link>
            <Link href="/products">
              <button className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                View Collection
              </button>
            </Link>
          </div>
          
          <div className="pt-6 flex items-center gap-4">
           
           
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-auto">
        <Image
          src="/66.png"
          alt="Stylish models wearing summer collection"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Promo Badge on Image */}
        <div className="absolute bottom-8 left-8 bg-white px-4 py-2 rounded-lg shadow-lg">
          <span className="block text-sm font-medium">Up to</span>
          <span className="block text-2xl font-bold">40% OFF</span>
        </div>
      </div>
    </section>
  );
};

export default SplitHero;
