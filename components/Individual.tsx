"use client";
import React from "react";
import Link from "next/link";
import { addToCart } from "@/redux/slice/cartSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


const Individual = ({ product, category }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    try {
      dispatch(addToCart(product));
      toast.success(` ${product.title} is added to cart `, {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
          borderRadius: "5px",
        },
      });
    } catch (error) {
      toast.error("Failed to add product to cart", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
          fontSize: "16px",
          padding: "10px",
          borderRadius: "5px",
        },
      });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 bg-white shadow rounded-lg p-6">
        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-xs h-auto object-contain"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
          </div>

          <div>
            <p className="text-xl font-semibold text-green-600 mb-4">
              ${product.price}
            </p>
            <button
              onClick={handleAddToCart}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-transform transform hover:scale-105 duration-200"
            >
              Add to Cart
            </button>
            <Link
              href={`/categories/${encodeURIComponent(category)}`}
              className="inline-block mt-4 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              ← Back to {category}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Individual;
