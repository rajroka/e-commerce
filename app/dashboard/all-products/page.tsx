'use client';

import React, { useEffect, useState } from 'react';
import { deleteProductByID, getAllproducts } from '@/app/api/products';
import Link from 'next/link';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: {
    rate: number;
    count: number;
  };
};

const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const deleteProduct = async (id: string) => {
    try {
      const response = await deleteProductByID(id);
      if (response) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getAllproducts();
      setProducts(result);
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="p-2 rounded-2xl bg-white hover:shadow-md transition-shadow duration-300 overflow-hidden relative group"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-2 py-1 bg-black bg-opacity-70 text-gray-100 text-xs rounded-2xl">
                {product.category}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h2>
              <p className="text-gray-600 font-medium">${product.price}</p>
              <p className="text-sm text-gray-400">Stock: {product.stock}</p>
            </div>

            <div className="px-4 pb-4 flex justify-between items-center">
              <Link
                href={`/dashboard/edit-product/${product._id}`}
                className="bg-blue-600 text-sm text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteProduct(product._id)}
                className="bg-red-500 text-sm text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProductsPage;
