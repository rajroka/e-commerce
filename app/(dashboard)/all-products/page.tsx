'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, Delete01Icon, Package01Icon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProducts(d.products ?? d))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={Package01Icon} size={22} color="#ef4444" strokeWidth={STROKE} />
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          {!loading && (
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {products.length}
            </span>
          )}
        </div>
        <Link href="/add-product"
          className="btn-primary text-sm px-4 py-2 rounded-xl">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <HugeiconsIcon icon={Package01Icon} size={40} color="#d1d5db" strokeWidth={STROKE} className="mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No products yet.</p>
          <Link href="/add-product" className="btn-primary">Add your first product</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
              <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                <Image src={product.image} alt={product.name} fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full capitalize">
                  {product.category}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{product.name}</h2>
                <p className="text-xs text-gray-400 mb-1">Stock: {product.stock}</p>
                <p className="text-base font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>

                <div className="mt-auto flex gap-2">
                  <Link href={`/edit-product/${product._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-red-500 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                    <HugeiconsIcon icon={Edit01Icon} size={13} color="white" strokeWidth={STROKE} /> Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    disabled={deleting === product._id}
                    className="flex items-center justify-center gap-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {deleting === product._id
                      ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={13} color="currentColor" strokeWidth={STROKE} className="animate-spin" />
                      : <HugeiconsIcon icon={Delete01Icon} size={13} color="currentColor" strokeWidth={STROKE} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
