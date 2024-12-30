import React from 'react';

const CartPage: React.FC = () => {
  // Example cart items
  const cartItems = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 120,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Product+Image',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 80,
      quantity: 2,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Product+Image',
    },
    {
      id: 3,
      name: 'Gaming Mouse',
      price: 40,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Product+Image',
    },
  ];

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-8 hero">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <h1 className="text-3xl font-bold text-center text-gray-800 py-4">Your Cart</h1>

        {/* Cart Items */}
        <div className="border-t border-gray-200">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 px-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <p className="text-gray-800">Qty: {item.quantity}</p>
                <button className="text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="py-6 px-6 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Total:</h2>
          <p className="text-xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
        </div>

        {/* Checkout Button */}
        <div className="py-6 px-6">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
