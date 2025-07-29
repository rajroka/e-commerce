import Product from '@/lib/modals/Product';
import connect from '@/lib/db';

export const fetchproducts = async () => {
  await connect();
  const products = await Product.find();

  return products.map(product => ({
    _id: product._id.toString(),               // ✅ convert ObjectId
    name: product.name,
    image: product.image,
    price: product.price,
    category: product.category,
    createdAt: product.createdAt?.toISOString(), // ✅ convert Date
    updatedAt: product.updatedAt?.toISOString(), // ✅ convert Date
  }));
};



export const fetchProductById = async (id: string) => {
  await connect();
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return {
    _id: product._id.toString(),               // ✅ convert ObjectId
    name: product.name,
    description: product.description || '', // ✅ provide fallback for missing description
    image: product.image,
    price: product.price,
    category: product.category,
    createdAt: product.createdAt?.toISOString(), // ✅ convert Date
      updatedAt: product.updatedAt?.toISOString(), // ✅ convert Date
    };
  };

  

  

export const getProductsByCategory = async (category: string) => {
  try {
    await connect(); // ensure DB is connected
    const products = await Product.find({ category: { $regex: new RegExp(category, 'i') }, });
    return products;
  } catch (err) {
    console.error("Error fetching by category:", err);
    throw new Error("Could not fetch products by category");
  }
};
