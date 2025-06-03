// app/categories/[category]/page.tsx

import Link from 'next/link';
import axios from 'axios';
import React from 'react';

async function getProductsByCategory(category: string) {
  const response = await axios.get(
    `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
  );
  return response.data;
}

export default async function CategoryProductsPage( { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params; // Access params from props
  const products = await getProductsByCategory(category);

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold capitalize mb-6">{category}</h1>

      <div className="grid grid-cols-1  md:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="p-4 rounded shadow bg-white">
            <img
              src={product.image}
              alt={product.title}
              className="h-40 object-contain mb-2 mx-auto"
            />
            <h2 className="text-sm font-medium">{product.title}</h2>
            <p className="text-gray-600 mb-2">${product.price}</p>
            <Link
              href={`/categories/${encodeURIComponent(product.category)}/${product.id}`}
              className="block text-center py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
