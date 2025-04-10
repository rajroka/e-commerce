import React from 'react';
import { allBlogs } from '../api/Allblog';
import Link from 'next/link';

const Page = async () => {
  const products = await allBlogs(); // Fetch the blogs/products

  return (
    <div className="page-container">
      <div className="w-screen px-6 md:px-12 lg:px-24 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {products.map((product: any, index: number) => (
            <div key={index} className="flex items-center justify-center flex-col gap-4 border p-4 overflow-hidden">
              {/* Ensure images are properly scaled and maintain aspect ratio */}
              <Link href={`/product/${product.id}`}><img 
                src={product.imageUrls || "default-image.jpg"} 
                alt={product.title} 
                className="w-full object-cover h-60 rounded-md"  // Updated height to 'h-60' (or any height you prefer)
              /></Link>
              <h1 className="text-xl  text-center font-bold ">{product.title}</h1>
              <h1 className="text-2xl  text-center font-medium">{product.price}</h1>

              <p className="text-lg text-center line-clamp-3 ">{product.description}</p>
              <Link href={`/product/${product.id}`}>
                 click here 
</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
