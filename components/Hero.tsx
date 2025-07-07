'use client';

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div
      className="h-screen relative bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] py-20 px-6 md:px-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10"
     
    >
    <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] ">
    <Image
     src="/hero2.png"
     alt="Logo"
     fill

     priority

    style={{
        objectFit: 'cover',

      }} />

      
    </div>

      {/* Left Content */}
      <div className="max-w-xl text-center md:text-left mt-52 z-50  top-40">
        <Link href="/products">
          <button className="   px-6 py-3 text-lg rounded-full bg-black text-white shadow-md">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
