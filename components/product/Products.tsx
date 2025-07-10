'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slice/cartSlice'; // Adjust path
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModalStore } from '@/store/modalStore';
import Image from 'next/image';
export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();
    const { openLogin } = useModalStore();

  // Assume your auth slice has isLoggedIn boolean
  const isLoggedIn = useSelector((state: any) => state.auth?.isLoggedIn);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, []);

  const displayedProducts = products.slice(0, 8);

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to your cart', {
        duration: 2000,
        position: 'top-right',
      });
      openLogin();
      return;
    }

    dispatch(
      addToCart({
        id: product._id || product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );

    toast.success(`Added "${product.name}" to cart`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">  Trending products  </h1>
        <Link
          href="/products"
          className="px-6 py-2.5   bg-gray-700  hover:bg-gray-900 text-white rounded font-medium  transition duration-200 shadow-md"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {displayedProducts.map((product) => (
          <div
            key={product._id || product.id}
            className="group bg-white border border-gray-200 rounded shadow-md hover:shadow-lg  transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative">
              <span className="absolute top-3 left-3  bg-gray-800  text-white text-xs px-3 py-1 rounded font-semibold shadow-md uppercase tracking-wider">
                {product.category}
              </span>
              <Link href={`/products/${product._id || product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  loading='lazy'
                  className="w-full h-60 object-contain p-5 bg-gray-50 transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            <div className=" px-2 py-2  flex flex-col flex-grow bg-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h2>
              {/* <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p> */}

              <div className="flex items-center justify-between mt-auto mb-4">

             <div className="flex items-center space-x-3">
                <p className="text-base  font-bold text-emerald-600">${(product.price * 0.8).toFixed(2)}</p>
  <p className="text-sm font-semibold text-gray-500 line-through">${product.price.toFixed(2)}</p>

</div>


                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  {'★'.repeat(Math.round(product.rating?.rate || 4))}
                  <span className="ml-1 text-gray-400 text-xs">({product.rating?.count || 120})</span>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  className="w-1/2 bg-indigo-60  bg-gray-700 hover:bg-gray-900 text-white py-2 rounded flex items-center justify-center gap-2 text-sm font-medium shadow"
                  onClick={() => handleAddToCart(product)}
                >
                  <FiShoppingCart className="text-base" /> Add to Cart
                </button>

                <Link
                  href={`/products/${product._id || product.id}`}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded flex items-center justify-center gap-2 text-sm font-medium border border-gray-300 shadow"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
