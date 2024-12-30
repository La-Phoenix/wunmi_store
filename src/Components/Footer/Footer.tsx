import React, { useState } from "react"
import { NavLink } from "../../Pages/Home/HomePage";
import "./Footer.css"



export const Footer: React.FC = () => {
    const [email, setEmail] = useState<string>('');


    const handleSubscribe = (e: React.FormEvent): void => {
        e.preventDefault();
        // Implementation for newsletter subscription
        console.log(`Subscribed email: ${email}`);
        setEmail('');
      };


    return (
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
    )
}