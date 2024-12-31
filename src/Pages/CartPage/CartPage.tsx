import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useAuth } from '../../Route/Route';

const CartPage: React.FC = () => {
  const { cartCount, darkMode, setDarkMode } = useAuth();

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
    <div
      className={`min-h-screen mt-16 py-8 ${
        darkMode ? 'bg-[#2d3748] text-gray-200' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <Navbar
        toggleDarkMode={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        cartCount={cartCount}
      />
      <div
        className={`max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}
      >
        <h1
          className={`text-3xl font-bold text-center py-4 ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          Your Cart
        </h1>

        {/* Cart Items */}
        <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row items-center justify-between py-4 px-6 space-y-4 sm:space-y-0 ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              } border-b`}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      darkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Qty: {item.quantity}
                </p>
                <button className="text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div
          className={`py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center ${
            darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-50 text-gray-800'
          }`}
        >
          <h2 className="text-xl font-semibold">Total:</h2>
          <p className="text-xl font-bold text-blue-500">${totalPrice.toFixed(2)}</p>
        </div>

        {/* Checkout Button */}
        <div className="py-6 px-4 sm:px-6">
          <button
            className={`w-full py-3 rounded-lg text-lg font-semibold ${
              darkMode
                ? 'bg-blue-600 text-gray-200 hover:bg-blue-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
