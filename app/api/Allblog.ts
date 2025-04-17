// allBlogs.js or allBlogs.ts (Make sure this is in the correct file and path)

import axios from 'axios';
// https://fakestoreapi.com/products/{id}
async function allProducts() {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    return response.data; // Return the data of the blog posts
  } catch (error) {
    console.error('Error fetching blogs:', error);
    
  }
}


// async function allProductById(id: string) {
//   try {
//     // Changed endpoint to match your actual API route
//     const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching blog:', error);
//     return null;
//   }
// }

 async function productById(id) {
   
  const response = axios.get(`https://fakestoreapi.com/products/${id}`)
    return (await response).data
 }


  async function postProduct(
  title: string,
  price: number,
  description: string,
  category: string,
  image: string
) {
  try {
    const response = await axios.post(
      'https://fakestoreapi.com/products',
      {
        title,
        price,
        description,
        category,
        image,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to post product:', error);
    throw error; // Re-throwing so the UI can also handle it if needed
  }
}
export {  allProducts   ,  productById , postProduct} ;
