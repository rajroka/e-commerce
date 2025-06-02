import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section 
      className="relative w-full min-h-screen flex items-center justify-center text-white"
      aria-label="Hero section with promotional offer"
    >
      {/* Background image with Next.js Image component for optimization */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/ggsolution.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content container */}
      <div className="bg-black bg-opacity-70 px-6 py-12 md:p-16 rounded-2xl text-center max-w-3xl mx-4 backdrop-blur-sm transition-all duration-500 hover:bg-opacity-80">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fadeIn">
          Best Prices <span className="text-green-400">Guaranteed</span>
        </h1>
        
        <p className="text-lg md:text-2xl font-medium mb-4">
          Incredible Prices on All Your Favorite Items
        </p>
        
        <p className="text-sm md:text-lg mb-8 max-w-2xl mx-auto">
          Get more for less on selected brands. Limited time offers - don't miss out!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" passHref
             className="inline-block bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white text-sm md:text-base font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105">
              Shop Now
            
          </Link>
          <Link href="/deals" passHref
             className="inline-block border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 text-white text-sm md:text-base font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl">
              View Deals
            
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free shipping on orders $50+
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            30-day money back guarantee
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;