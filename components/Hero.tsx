import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: `url("/ggsolution.png")`, // Make sure this image is inside /public
      }}
    >
      <div className="bg-black bg-opacity-60 px-6 py-12 md:p-16 rounded-2xl text-center max-w-3xl mx-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Best Prices
        </h1>
        <p className="text-lg md:text-2xl font-medium mb-4">
          Incredible Prices on All Your Favorite Items
        </p>
        <p className="text-sm md:text-lg mb-6">
          Get more for less on selected brands
        </p>
        <Link href="/products">
          <span className="inline-block bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white text-sm md:text-base font-semibold px-6 py-3 rounded-full shadow-lg">
            Shop Now
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
