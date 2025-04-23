"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Search: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500); // Delay debounce to 500ms
  const router = useRouter();

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products?search=${debouncedQuery}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full z-50 bg-white shadow-xl rounded-b-lg px-4 py-4 sm:px-10 sm:py-6"
          >
            <div className="flex justify-between items-center gap-4 max-w-5xl mx-auto">
              <input
                type="text"
                value={query}
                placeholder="Search products..."
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <IoClose size={24} />
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="loader">Loading...</div>
              </div>
            )}

            {results.length > 0 && !loading && (
              <div className="mt-4 space-y-4 max-w-5xl mx-auto">
                <ul>
                  {results.map((product: any) => (
                    <li
                      key={product.id}
                      onClick={() => {
                        router.push(`/shop/${product.id}`);
                        onClose();
                      }}
                      className="cursor-pointer flex items-center py-3 px-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
                    >
                      <div className="w-20 h-20 overflow-hidden rounded-md mr-4">
                        <Image
                          height={100}
                          width={100}
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">
                          {product.title}
                        </div>
                        <div className="text-gray-600">{product.category}</div>
                        <div className="mt-1">
                          <span className="text-gray-500 line-through mr-2">
                            ${product.price}
                          </span>
                          <span className="text-red-600 font-bold">
                            ${product.discountedPrice}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="mt-4 text-center text-gray-500">
                No products found for "{query}"
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Search;
