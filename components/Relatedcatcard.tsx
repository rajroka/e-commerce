import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Relatedcatcard = ({ products }: { products: any[] }) => {
  if (products.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-8 px-4">No related products found.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 px-4 sm:px-8 lg:px-16">
      {products.map((product) => (
        <Link
          href={`/products/${product._id}`}
          key={product._id}
          className="group bg-white border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden"
        >
          <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            <p className="text-sm font-semibold text-gray-700 mt-1">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Relatedcatcard;


