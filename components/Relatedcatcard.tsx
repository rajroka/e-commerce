import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Relatedcatcard = ({ products }: { products: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-4">
      {products.map((product) => (
        <Link href={`/product/${product._id}`} key={product._id}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                {product.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                {product.description}
              </p>
              <div className="mt-2 text-primary font-bold text-lg">
                ${product.price}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Relatedcatcard;
