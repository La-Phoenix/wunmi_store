import React, { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import "./HomePage.css";
import { useAuth } from '../Route/Route';
import axios from 'axios';
import { API_BASE_URL } from '../Auth/Auth';
import accessories from "../assets/imgs/martin-de-arriba-uf_IDewI6iQ-unsplash-min.jpg";
import clothes from "../assets/imgs/junko-nakase-Q-72wa9-7Dg-unsplash.jpg";
import elctronics from "../assets/imgs/josh-calabrese-mZf9BZxyKZE-unsplash.jpg";
import bags from "../assets/imgs/arno-senoner-iUvQRvdIhsY-unsplash.jpg";
import shoes from "../assets/imgs/jaclyn-moy-ugZxwLQuZec-unsplash.jpg";
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';

const categories = [
    {
      id: 1,
      name: "Accessories",
      price: 79.99,
      image: accessories,
    },
    {
      id: 2,
      name: "Clothes",
      price: 129.99,
      image: clothes,
    },
    {
      id: 4,
      name: "Electronics",
      price: 199.99,
      image: elctronics,
    },
    {
      id: 3,
      name: "Shoes",
      price: 89.99,
      image: shoes,
    },
    {
      id: 5,
      name: "Bags",
      price: 89.99,
      image: bags,
    },
];


interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: { name: string }
}

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, className = "text-gray-600 hover:text-gray-900" }) => (
  <a href={href} className={className}>
    {children}
  </a>
);


interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  darkMode: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, darkMode }) => (
  <div className={`rounded-lg shadow-md overflow-hidden transition-shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
    <img
      src={product.images[0]}
      alt={product.title}
      className="w-full h-64 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.category.name}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">${product.price}</span>
        <button 
          onClick={() => onAddToCart(product.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

// HomePage.jsx
const HomePage: React.FC = () => {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const {isLoggedIn, logout, setIsLoading } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    // Load saved theme from localStorage if available
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleAddToCart = (productId: number): void => {
    // Implementation for adding to cart
    console.log(`Added product ${productId} to cart`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} home`}>
      {/* Navigation */}
      <Navbar toggleDarkMode={() => setDarkMode(!darkMode)} darkMode={darkMode} />

      {/* Hero Section */}
      <div className={`py-32 ${darkMode ? 'bg-gray-800 text-gray-900' : 'bg-gray-100 text-white bg-white/70'} hero`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ShopHub</h1>
          <p className="text-lg mb-8">Discover amazing products from verified sellers</p>
          <button
            className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-32" id="categories">
        <h2 className="text-2xl font-bold mb-8 text-white">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              className={`rounded-lg shadow-md overflow-hidden transition-shadow py-12 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <h3 className="text-lg font-semibold p-4">{category.name}</h3>
              <img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
              <NavLink href={`/category/${category.name}`} className="block px-4 py-2 text-blue-600 hover:text-blue-700">
                View Products
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12" id="preview">
        <h2 className="text-2xl font-bold mb-8 text-white">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className={`rounded-lg shadow-md overflow-hidden transition-shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm mb-2">{product.category.name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price}</span>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => console.log(`Added product ${product.id} to cart`)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};


export default HomePage;