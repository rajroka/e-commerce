import ProductNav from '@/components/ProductNav'; // Adjust the import if needed

async function getProducts(category: string | null) {
  const endpoint = category
    ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
    : 'https://fakestoreapi.com/products';

  const res = await fetch(endpoint);
  return res.json();
}

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const products = await getProducts(searchParams.category || null);

  return (
    <div>
      <ProductNav />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-2 rounded">
            <img src={product.image} alt={product.title} className="h-40 object-contain mx-auto" />
            <h2 className="text-sm mt-2">{product.title}</h2>
            <p className="font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
