import Link from 'next/link';

async function getProductsByCategory(category: string) {
  const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
  return res.json();
}

export default async function CategoryProductsPage({ params }: { params: { category: string } }) {
  const products = await getProductsByCategory(params.category);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize mb-4">{params.category}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="p-4 rounded shadow bg-white">
            <img
              src={product.image}
              alt={product.title}
              className="h-40 object-contain mb-2 mx-auto"
            />
            <h2 className="text-sm font-medium">{product.title}</h2>
            <p className="text-gray-600">${product.price}</p>
            <Link
              href={`/categories/${encodeURIComponent(product.category)}/${product.id}`}
              className="block text-center py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
