'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
};

const DashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
 
   const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      {/* <div className="w-64 bg-[#101828] text-white shadow-md">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-6">
          <ul className="space-y-3">
            <li>
              <Link
                href="/dashboard/all-products"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
              >
                Edit Products
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/add-product"
                className="block px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
              >
                Add Products
              </Link>
            </li>
          </ul>
        </nav>
      </div> */}

      {/* Main Content Area */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">All Products</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {product.category}
                    </p>
                    <p className="text-gray-800 font-bold mt-2">${product.price}</p>
                  </div>
                  <Link
                    href={`/dashboard/edit-product/${product._id}`}
                    className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DashboardPage;
