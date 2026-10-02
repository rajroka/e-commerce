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

export const fetchProductById = async (id: string) => {
  await connect();
  const product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found');
  }

  return {
    _id:         product._id.toString(),
    name:        product.name,
    description: product.description || '',
    image:       product.image,
    price:       product.price,
    category:    product.category,
    stock:       product.stock       ?? 0,
    rating:      product.rating      ?? 0,
    reviewCount: product.reviewCount ?? 0,
    createdAt:   product.createdAt?.toISOString() || '',
    updatedAt:   product.updatedAt?.toISOString() || '',
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

// Fetch products with pagination and optional search
export const fetchProductsPaginated = async (page: number = 1, limit: number = 12, search?: string) => {
  await connect();

  const validPage  = isNaN(page)  || page  < 1 ? 1  : page;
  const validLimit = isNaN(limit) || limit < 1 ? 12 : Math.min(limit, 100);

  const query: Record<string, any> = {};
  if (search?.trim()) {
    query.$or = [
      { name:        { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { category:    { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const [rawProducts, totalCount] = await Promise.all([
    Product.find(query)
      .skip((validPage - 1) * validLimit)
      .limit(validLimit),
    Product.countDocuments(query),
  ]);

  const products = rawProducts.map((product) => ({
    _id:          product._id.toString(),
    name:         product.name,
    description:  product.description  || '',
    image:        product.image,
    price:        product.price,
    category:     product.category,
    stock:        product.stock        ?? 0,
    rating:       product.rating       ?? 0,
    discountPct:  product.discountPct  ?? null,
    discountEndsAt: product.discountEndsAt?.toISOString() ?? null,
    createdAt:    product.createdAt?.toISOString() || '',
    updatedAt:    product.updatedAt?.toISOString() || '',
  }));

  return {
    products,
    totalCount,
    page: validPage,
    totalPages: Math.ceil(totalCount / validLimit),
  };
};
