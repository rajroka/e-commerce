'use client';

import { useSelector } from 'react-redux';
import { selectCartItems, selectCartQuantity, selectCartTotal } from '../../store/selectors/cartSelectors';

const CartPage = () => {
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
            <div key={item.id} className="flex justify-between items-center border p-3 rounded-lg">
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-right text-purple-600 font-semibold">${item.price * item.quantity}</p>
            </div>
          ))}
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
