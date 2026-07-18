"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

type FilterFormData = { searchTerm: string };

const Filter = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FilterFormData>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = (data: FilterFormData) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("name", data.searchTerm);
    router.push("/products?" + params.toString());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search products…"
        {...register("searchTerm", { required: "Search term is required" })}
        className="input"
      />
      <button type="submit"
        className="btn-primary px-4 py-2.5 rounded-xl gap-2">
        <HugeiconsIcon icon={Search01Icon} size={16} color="white" strokeWidth={1.5} />
        Search
      </button>
      {errors.searchTerm && (
        <span className="text-red-500 text-sm">{errors.searchTerm.message}</span>
      )}
    </form>
  );
};

export default Filter;


