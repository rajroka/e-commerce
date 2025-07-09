'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartQuantity,
  selectCartTotal,
  addToCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
} from '@/redux/slice/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalQty = useSelector(selectCartQuantity);
  const totalAmount = useSelector(selectCartTotal);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: items }),
    });
    
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">🛒 Your Cart</h1>

      {items.length === 0 ? (
        <section className="text-center text-gray-600">
          <p className="mb-4 text-lg">Your cart is empty.</p>
          <Link
            href="/products"
            className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold transition"
          >
            ← Continue Shopping
          </Link>
        </section>
      ) : (
        <>
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 border rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain rounded"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 min-w-0 sm:ml-6">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h2>

                  <div className="mt-3 flex items-center gap-3" aria-label={`Adjust quantity of ${item.title}`}>
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      −
                    </button>
                    <span className="font-medium text-sm" aria-live="polite" aria-atomic="true">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(addToCart(item))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-semibold text-indigo-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-sm text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <section className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-lg font-semibold text-gray-800">
            <p>
              Total Items: <span className="font-bold">{totalQty}</span>
            </p>
            <p>
              Total Price:{' '}
              <span className="text-indigo-700 font-bold">${totalAmount.toFixed(2)}</span>
            </p>
          </section>

          <section className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 underline text-sm sm:text-base"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
              aria-label="Proceed to checkout"
            >
              Checkout
            </button>
          </section>
        </>
      )}
    </main>
  );
};

export default CartPage;
