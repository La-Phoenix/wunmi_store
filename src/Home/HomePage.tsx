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

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = "text-gray-600 hover:text-gray-900" }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    className="text-gray-600 hover:text-gray-900"
  >
    {children}
  </button>
);

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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

// const products: Product[] = [
//   {
//     id: 1,
//     name: "Leather Backpack",
//     price: 79.99,
//     image: "/api/placeholder/300/300",
//     category: "Accessories"
//   },
//   {
//     id: 2,
//     name: "Wireless Headphones",
//     price: 129.99,
//     image: "/api/placeholder/300/300",
//     category: "Electronics"
//   },
//   {
//     id: 3,
//     name: "Running Shoes",
//     price: 89.99,
//     image: "/api/placeholder/300/300",
//     category: "Sports"
//   },
//   {
//     id: 4,
//     name: "Smart Watch",
//     price: 199.99,
//     image: "/api/placeholder/300/300",
//     category: "Electronics"
//   },
//   {
//     id: 5,
//     name: "Sunglasses",
//     price: 49.99,
//     image: "/api/placeholder/300/300",
//     category: "Accessories"
//   },
//   {
//     id: 6,
//     name: "Denim Jacket",
//     price: 69.99,
//     image: "/api/placeholder/300/300",
//     category: "Clothing"
//   }
// ];

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [open, setOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {isLoggedIn, logout, setIsLoading } = useAuth()

  const handleAddToCart = (productId: number): void => {
    // Implementation for adding to cart
    console.log(`Added product ${productId} to cart`);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
        console.log(response.data[0]);
        setProducts(response.data);
      } catch (error) {
        console.log(error)
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleSubscribe = (e: React.FormEvent): void => {
    e.preventDefault();
    // Implementation for newsletter subscription
    console.log(`Subscribed email: ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 home">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md shadow-lg fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 font-bold text-xl">
              <h3>ShopHub</h3>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="#">Shop</NavLink>
              <NavLink href="#">Categories</NavLink>
              <NavLink href="#">About</NavLink>
             { !isLoggedIn && <NavLink href="/auth">Login</NavLink>}
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <IconButton>
                <Search size={20} />
              </IconButton>
              <IconButton>
                <Heart size={20} />
              </IconButton>
              <IconButton>
                <ShoppingCart size={20} />
              </IconButton>
              <div className="dropdown-container">
                {/* IconButton triggers dropdown toggle */}
                <IconButton onClick={toggleDropdown}>
                  <User size={20} />
                </IconButton>

                {/* Dropdown menu */}
                {open && (
                  <div className="dropdown-menu">
                    <ul>
                      <li>Profile</li>
                      <li>Settings</li>
                      {isLoggedIn && <li onClick={() => logout()}>Logout</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Home
              </NavLink>
              <NavLink href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Shop
              </NavLink>
              <NavLink href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Categories
              </NavLink>
              <NavLink href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                About
              </NavLink>
              { !isLoggedIn && <NavLink href="/auth">Login</NavLink>}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-100 py-32 hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ShopHub
            </h1>
            <p className="text-lg mb-8" style={{color: "#22251e"}}>
              Discover amazing products from verified sellers
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              Shop Now
            </button>
          </div>
        </div>
      </div>


        {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-32">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow py-12">
              <h3 className="text-lg font-semibold text-gray-900 p-4">{category.name}</h3>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <NavLink href={`/category/${category}`} className="block px-4 py-2 text-blue-600 hover:text-blue-700">
                View Products
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About ShopHub</h3>
              <p className="text-gray-400">Your one-stop destination for quality products from verified sellers.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><NavLink href="#" className="text-gray-400 hover:text-white">Home</NavLink></li>
                <li><NavLink href="#" className="text-gray-400 hover:text-white">Shop</NavLink></li>
                <li><NavLink href="#" className="text-gray-400 hover:text-white">Categories</NavLink></li>
                <li><NavLink href="#" className="text-gray-400 hover:text-white">About</NavLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><NavLink href="#" className="text-gray-400 hover:text-white">Contact Us</NavLink></li>
                <li><NavLink href="#" className="text-gray-400 hover:text-white">FAQs</NavLink></li>
                <li><NavLink href="#" className="text-gray-400 hover:text-white">Shipping Info</NavLink></li>
                <li><NavLink href="#" className="text-gray-400 hover:text-white">Returns</NavLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-700 text-white px-4 py-2 rounded-l focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;