// app/products/[productId]/page.tsx


import React from 'react';
import Image from 'next/image';
import { productById } from '@/app/api/Allblog';

const Page = async ({ params }: { params: { productId: string } }) => {

  const id = (await params).productId;
  const product = await productById(id);
  const discountedPrice = (product.price * 0.9).toFixed(2); // 10% off

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-green-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 text-black mt-30  dark:text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-zinc-800 p-6 flex items-center justify-center">
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{product.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base line-clamp-6">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-green-600 dark:text-green-400 text-lg sm:text-xl font-semibold">
              <span className="line-through text-red-500">${product.price}</span>
              <span>${discountedPrice}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.category})
              </span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-yellow-500 text-sm">
              ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
            </p>

            <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-transform transform hover:scale-105 duration-200">
              Add to Cart
            </button>

            {/* Go Back Button */}
            {/* <Link
              onClick={() => router.replace('/products')}
              href=""
              className="mt-3 w-full bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 text-black dark:text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              ← Go Back
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
