import axios from 'axios';
import { data } from 'framer-motion/client';
import { NextResponse } from 'next/server';

export async function postProduct(data: {  name: string; description: string; price: number; image: string; category: string; stock: number; rating: number; reviews: number; }){
  const response = await axios.post('/api/products', data, {
    headers: {
      'Content-Type': 'application/json'
  }



    
   




  })
  return response.data;

}




// export async function getAllProductsApi() {
//   try {
//     const response = await axios.get("/api/products");
//     return response.data;
//   } catch (error: any) {
//     console.error("Failed to fetch products:", error.message);
//     throw new Error("Unable to fetch products");

//   }
// }

export async function getByID(id:string){
  try {

    const response = await axios.get(`/api/products/${id}`);
    if (!response.data) {
      throw new Error("Product not found");
    }
    return response.data;

    
  } catch (error) {
    
    console.error("Error fetching product by ID:", error);
    throw new Error("Product not found");

  }
}


export async function getAllproducts(){
   const response = await axios.get("/api/products")

   
   return response.data


}

 const fetchproducts = async () => {
      try {
        const response = await axios.get("/api/products");
        return response.data
      } catch (error) {
        console.error("Blogs not found", error);
      }
    };

    export {fetchproducts}

export async function postImage(imageFile: File) {
  // Create FormData and append file + upload_preset
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'your_upload_preset'); // Replace with your preset name

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/dcn24jfwx/image/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data; // This contains secure_url, public_id, etc.
}







export async function updateProductByID(id: string, data: any) {
  try {
    const response = await axios.put(`/api/products/${id}`, data , {
      headers: {
        'Content-Type': 'application/json',
      },
    }); // ✅ PUT for update
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}



export async function deleteProductByID(id: string){

  try {

    const response = await axios.delete(`/api/products/${id}`);
    if (response.status !== 200) {
      throw new Error('Failed to delete product');
    }

    return response.data; 

    
  } catch (error) {


    console.error("Error deleting product:", error);
    NextResponse.json({"message": "Failed to delete product"}, { status: 500 });
    
  }

}