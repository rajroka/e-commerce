import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Relatedcatcard = ({ products }: { products: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-4">
      {products.length > 0 ? (
        products.map((product) => (
          <Link href={`/products/${product._id}`} key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
            <h3 className="text-md font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">${product.price}</p>
          </Link>
        ))
      ) : (
        <p>No related products found.</p>
      )}
    </div>
  );
};

export default Relatedcatcard;
