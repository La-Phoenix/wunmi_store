// src/components/Navbar.tsx
import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Route/Route';
import DarkModeToggle from '../ToggleDarkMode';
import "./Navbar.css"

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
  <button onClick={onClick} className="text-gray-600 hover:text-gray-900">
    {children}
  </button>
);

const Navbar: React.FC<{ toggleDarkMode: () => void; darkMode: boolean; }> = ({ toggleDarkMode, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <nav  className ={`backdrop-blur-md shadow-lg fixed top-0 w-full z-10 '${
        darkMode ? 'bg-gray-900 text-white' : 'text-gray-900 bg-white/70 '
      }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="logo">
            <span className="logo-primary">Wunmi</span><span className="logo-secondary">store</span>
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
            {!isLoggedIn && <NavLink href="/auth">Login</NavLink>}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme Toggle Button */}
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
              <IconButton onClick={toggleDropdown}>
                <User size={20} />
              </IconButton>

              {/* Dropdown menu */}
              {open && (
                <div className="dropdown-menu">
                  <ul>
                    {isLoggedIn && <li onClick={() => navigate("/profile")}>Profile</li>}
                    {isLoggedIn && <li onClick={() => navigate("/upload-product")}>Upload Product</li>}
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
            <NavLink href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              About
            </NavLink>
            {isLoggedIn && (
              <NavLink href="upload-product" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Upload Product
              </NavLink>
            )}
            {!isLoggedIn && <NavLink href="/auth">Login</NavLink>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
