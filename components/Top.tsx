"use client";
import Link from "next/link";
import React from "react";

const Top = () => {
  return (
    <div className="w-full  px-6 md:px-12 lg:px-24 z-50 relative   bg-black text-white text-sm font-semibold">
      <div className="w-full flex justify-between  items-center  h-14 ">
        <div className="flex items-center justify-center ">Free Shipping for orders over $50</div>
        <div className=" items-center justify-between gap-8 hidden md:flex"> 
          <Link href="/" className=" hover:underline">About  </Link>
            <Link href="/" className=" hover:underline">Contact</Link>
            <Link href="/" className=" hover:underline">Help center</Link>
            <Link href="/" className=" hover:underline">Call Us 123-456-7890</Link>
            {/* <Link href="/blogs" className=" hover:underline">  </Link> */}
            {/* <Link href="/products" className=" hover:underline">products  </Link>
            <Link href="/products" className=" hover:underline">category   </Link> */}
          
        </div>
      </div>
    </div>
  );
};

export default Top;
