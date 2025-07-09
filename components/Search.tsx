'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
interface Product {
  id: number;
  title: string;
  image: string;
}

const SearchPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
    const router = usePathname();
  const query  = router.split('?')[1] ? router.split('?')[1].split('=')[1] : ''; 
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('api/products');
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
    };
    fetchProducts();
  }, []);

  // Filter based on search
  useEffect(() => {
    if(query){
      const filteredResults = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredResults);
    }
   
  }, [query, products]);

  return (
    <div className="p-6 min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Search bar */}
      

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div key={product.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="mt-4 font-semibold text-lg dark:text-white">{product.title}</h2>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
