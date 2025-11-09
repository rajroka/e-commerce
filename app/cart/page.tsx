'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CartPage = () => {
  const { data: session } = useSession();

  // Only access Zustand on client side
  const cartItems = useCartStore((state) => state.items);
  const totalQty = useCartStore((state) =>
    state.items.reduce((acc, i) => acc + i.quantity, 0)
  );
  const totalAmount = useCartStore((state) =>
    state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  );

  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Please login to checkout', { duration: 2000 });
      return;
    }

    const stripe = await stripePromise;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error('Checkout failed', { duration: 2000 });
    }
  };

  if (cartItems.length === 0)
    return (
      <main className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-indigo-600 hover:text-indigo-800">
          ← Continue Shopping
        </Link>
      </main>
    );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">🛒 Your Cart</h1>

      <ul className="space-y-6">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="relative w-24 h-24">
              <Image src={item.image} alt={item.name} fill className="object-contain rounded" />
            </div>

            <div className="flex-1 sm:ml-6">
              <h2 className="text-lg font-semibold">{item.name}</h2>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-lg font-semibold">
        <p>Total Items: <span>{totalQty}</span></p>
        <p>Total Price: <span>${totalAmount.toFixed(2)}</span></p>
      </section>

      <section className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
        <Link href="/products" className="text-gray-600 hover:underline">
          ← Continue Shopping
        </Link>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Checkout
        </button>
      </section>
    </main>
  );
};

export default CartPage;
