'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartQuantity,
  selectCartTotal,
  addToCart,
  removeFromCart,
  decreaseQuantity,
} from '@/redux/slice/cartSlice';
import Image from 'next/image';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalQty = useSelector(selectCartQuantity);
  const totalAmount = useSelector(selectCartTotal);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border p-3 rounded-lg"
            >
              {/* Image */}
              <div className="w-16 h-16 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain rounded"
                />
              </div>

              {/* Details */}
              <div className="flex-1 ml-4">
                <h2 className="text-lg font-semibold line-clamp-1">{item.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price and Remove */}
              <div className="flex flex-col items-end gap-1">
                <p className="text-purple-600 font-semibold">
                  ${Number(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="border-t pt-4 mt-4 flex justify-between text-lg font-bold">
            <span>Total Items: {totalQty}</span>
            <span>Total: ${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
