"use client";
import React from 'react'
import { getAllProductsApi } from "@/app/api/products"
import { useEffect } from 'react'
import { useState } from 'react'
const page = () => {
   const [products, setProducts] = useState([]);

   useEffect(() => {
    async function fetchproduct(){
      const produc  = await getAllProductsApi();
      setProducts(produc);
     }  fetchproduct();
   },[])

  return (
    <div>{products.map((product)=>
        product.name + " " + product.description + " " + product.price + " " + product.image + " " + product.category + " " + product.stock + " " + product.rating + " " + product.reviews + "\n"

    )}</div>
  )
}

export default page