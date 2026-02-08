import Product from '@/lib/modals/Product';
import connect from '@/lib/db';

// Fetch all products
export const fetchProducts = async () => {
  await connect();
  const products = await Product.find();

  return products.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description || '',
    image: product.image,
    price: product.price,
    category: product.category,
    createdAt: product.createdAt?.toISOString() || '',
    updatedAt: product.updatedAt?.toISOString() || '',
  }));
};

// Fetch a single product by ID
export const fetchProductById = async (id: string) => {
  await connect();
  const product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found');
  }

  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description || '',
    image: product.image,
    price: product.price,
    category: product.category,
    createdAt: product.createdAt?.toISOString() || '',
    updatedAt: product.updatedAt?.toISOString() || '',
  };
};

// Fetch products by category (case-insensitive)
export const getProductsByCategory = async (category: string) => {
  await connect();
  const products = await Product.find({
    category: { $regex: new RegExp(`^${category}$`, 'i') }, // exact match, case-insensitive
  });

  // Map to consistent output
  return products.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description || '',
    image: product.image,
    price: product.price,
    category: product.category,
    createdAt: product.createdAt?.toISOString() || '',
    updatedAt: product.updatedAt?.toISOString() || '',
  }));
};
