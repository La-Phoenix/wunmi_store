import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../Pages/Auth/Auth';
import { ProductCard } from '../../Pages/Home/HomePage';
import Navbar from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';
import { Product } from '../../Pages/Profile/ProfilePage';
import { useAuth } from '../../Route/Route';


const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const {cartCount, handleAddToCart} = useAuth();

  // Toggle dark mode and save preference to localStorage
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products/category/${categoryName}`);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to load products for this category');
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  

  return (
    <div className={`min-h-screen transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navbar */}
      <Navbar toggleDarkMode={() => setDarkMode(!darkMode)} darkMode={darkMode} cartCount={cartCount} />

      {/* Hero Section */}
      <div className={`py-20`}>
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-4xl font-semibold">{categoryName} Collection</h1>
          <p className="text-lg mt-4">Explore the best products in {categoryName}</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard
                darkMode= {darkMode}
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                isClickable = {true}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-4">No products available in this category.</p>
          )}
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 rounded-lg shadow-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CategoryPage;
