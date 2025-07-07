"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi"; // 🔍 Import search icon

type FilterFormData = {
  searchTerm: string;
};

const Filter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterFormData>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
    

  const onSubmit = (data: FilterFormData) => {
    console.log("Search submitted:", data.searchTerm);
     const params = new URLSearchParams(searchParams.toString())
      params.set("name", data.searchTerm);
      console.log("Updated search params:", params.toString());
       router.push("/products" + '?' + params.toString());
      return params.toString()
    
  
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 border border-white p-2 rounded"
    >
      <input
        type="text"
        placeholder="Search products..."
        {...register("searchTerm", { required: "Search term is required" })}
        className="py-2 px-4 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <FiSearch size={18} /> {/* 🔍 Search Icon */}
        Search
      </button>

      {errors.searchTerm && (
        <span className="text-red-500 text-sm ml-2">
          {errors.searchTerm.message}
        </span>
      )}
    </form>
  );
};

export default Filter;
function createQueryString(arg0: string, arg1: string) {
    throw new Error("Function not implemented.");
}

