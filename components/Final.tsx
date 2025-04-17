import React from 'react'
import Link from "next/link";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
}

const FinalProduct: React.FC<{ sortedProducts: Product[] }> = ({ sortedProducts }) => {
  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow hover:shadow-lg transition duration-200 flex flex-col"
                >
                  <div className="w-full h-52 flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain h-full max-h-48"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                      {product.title}
                    </h2>
                    <p className="text-green-600 dark:text-green-400 font-bold text-xl mt-1">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
  )
}

export default FinalProduct