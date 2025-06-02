export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; productId: string };
}) {
  try {
    const id = params.productId;  // capital I here matches folder name
    
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) {
      throw new Error('Product not found');
    }
    const product = await res.json();

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
        <img
          src={product.image}
          alt={product.title}
          className="h-64 object-contain mx-auto mb-4"
        />
        <p className="text-gray-700 mb-2">${product.price}</p>
        <p className="mb-4">{product.description}</p>
        <p className="text-sm text-gray-500">Category: {params.category}</p>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Failed to load product</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}
