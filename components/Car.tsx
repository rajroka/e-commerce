'use client';
import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState<{ id: number; title: string; category: string; price: number }[]>([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://fakestoreapi.com/products'); // Example API
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const allCategories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = category === 'All'
    ? products
    : products.filter(p => p.category === category);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded ${
              category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-bold text-lg">{product.title}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-green-600 font-semibold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
