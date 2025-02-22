// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Route/Route';
import DarkModeToggle from '../../ToggleDarkMode';
import "./Navbar.css"
import { Link } from 'react-router-dom';

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
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, className = "" }) => (
  <button onClick={onClick} className={`relative flex items-center justify-center text-gray-600 hover:text-gray-900 ${className}`}>
    {children}
  </button>
);

const Navbar: React.FC<{ toggleDarkMode: () => void; darkMode: boolean; cartCount: number }> = ({ toggleDarkMode, darkMode, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);


  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setOpen(!open);
  };

  // Close mobile device dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleMobileClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Only attach the event listener when the mobile menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleMobileClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleMobileClickOutside);
  }, [isMenuOpen]);


  return (
    <nav  className ={`backdrop-blur-md shadow-lg fixed top-0 w-full z-10 '${
        darkMode ? 'bg-gray-900 text-white' : 'text-gray-900 bg-white/70 '
      }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="logo">
            <span className="logo-primary">Ahavah</span><span className="logo-secondary">Stores</span>
        </div>



          <div className="md:hidden">
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <a
              className="cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() =>
                document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Shop
            </a>
            <a
              className="cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() =>
                document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Categories
            </a>
            <NavLink href="#">About</NavLink>
            {!isLoggedIn && <Link className="cursor-pointer text-gray-600 hover:text-gray-900" to="/auth">Login</Link>}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme Toggle Button */}
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <IconButton onClick={() => navigate("/search")}>
              <Search size={20} />
            </IconButton>
            <IconButton>
              <Heart size={20} />
            </IconButton>
            <IconButton onClick={() => navigate("/cart")}>
              {isLoggedIn ? (
                <div className="relative">
                  <ShoppingCart size={20}/>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </div>
              ) : (
                <ShoppingCart size={20} />
              )}
            </IconButton>
            <div className="dropdown-container" ref={dropdownRef}>
              <IconButton onClick={toggleDropdown}>
                <User size={20} />
              </IconButton>

              {/* Dropdown menu */}
              {open && (
                <div className={`dropdown-menu ${ darkMode ? 'bg-gray-800 dropdown-menu-dark' : '' }` } >
                  <ul>
                    {isLoggedIn && <li onClick={() => navigate("/profile")}>Profile</li>}
                    {isLoggedIn && <li onClick={() => navigate("/upload-product")}>Upload Product</li>}
                    {isLoggedIn && <li onClick={() => navigate('/chats')}>Chats</li>}
                    {isLoggedIn && <li onClick={() => navigate('/users/with-products/')}>Sellers</li>}
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
        <div className="md:hidden" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/home"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Search
              </Link>
              
              <a
                className="cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => {
                  // Scroll to preview first, then close the menu after a short delay
                  document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setIsMenuOpen(false), 100);
                }}
              >
                Shop
              </a>
              <a
                className="cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => {
                  // Scroll to categories then close the menu after a short delay
                  document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => setIsMenuOpen(false), 100);
                }}
              >
                Categories
              </a>
              <Link
                to="/users/with-products/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Sellers
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Cart
              </Link>
              <Link
                to="/chats"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Chats
              </Link>
              {isLoggedIn && (
                <Link
                  to="/upload-product"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Upload Product
                </Link>
              )}
              {!isLoggedIn && (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
              )}
              {isLoggedIn && (
                <a
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </a>
              )}
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
