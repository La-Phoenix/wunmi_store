import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../Pages/Auth/Auth';
import { Product } from '../../Pages/Profile/ProfilePage';
import { useAuth } from '../../Route/Route';

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = useParams<{ productId: string }>();
  const { cartCount } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data: Product = await response.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return (
    <div className="bg-gray-100 min-h-screen lg:h-screen h-v py-8 px-4 sm:px-8 flex items-center justify-center hero">
      <Navbar toggleDarkMode={() => setDarkMode(!darkMode)} darkMode={darkMode} cartCount={cartCount}  />
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden h-[80%] flex">
        <div className="flex flex-col md:flex-row w-full">
          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-200">
            <img
              src={product?.imageUrl}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product?.name}</h1>
              <p className="mt-4 text-gray-600">{product?.category}</p>
              <p className="mt-4 text-gray-800">{product?.description}</p> {/* Display description */}
            </div>

            <div className="mt-6">
              <span className="text-xl font-semibold text-blue-600">
                ${product?.price.toFixed(2)}
              </span>
              {product?.inStock ? (
                <p className="mt-2 text-sm text-green-600">In Stock</p>
              ) : (
                <p className="mt-2 text-sm text-red-600">Out of Stock</p>
              )}
            </div>

            <button
              className={`mt-8 px-6 py-3 text-white font-semibold rounded-lg ${
                product?.inStock
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!product?.inStock}
            >
              {product?.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
