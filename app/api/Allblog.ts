// allBlogs.js or allBlogs.ts (Make sure this is in the correct file and path)
import axios from 'axios';

async function allBlogs() {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    return response.data; // Return the data of the blog posts
  } catch (error) {
    console.error('Error fetching blogs:', error);
    
  }
}

async function allBlogsById(id) {
    
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      return response.data; 
       
    
  }

export { allBlogs  , allBlogsById };
