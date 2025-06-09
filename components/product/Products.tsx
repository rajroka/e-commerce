'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Limit to 8 products (2 rows if 4 columns)
  const displayedProducts = products.slice(0, 8);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">All Products</h1>
        <Link
          href="/products"
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product: any) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="relative rounded-2xl p-5 shadow hover:shadow-lg transition duration-200 bg-white border border-gray-200 hover:border-gray-300"
          >
            {/* Sale badge */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              On Sale Now
            </div>

            {/* Product Image */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain mb-4"
            />

            {/* Product Title */}
            <h2 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.title}
            </h2>

            {/* Product Price */}
            <p className="text-lg font-bold text-green-600">${product.price}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
