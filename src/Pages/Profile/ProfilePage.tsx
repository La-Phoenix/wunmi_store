import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css";
import axios from 'axios';
import { API_BASE_URL } from '../Auth/Auth';
import { useAuth } from '../../Route/Route';

export interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  inStock?: boolean;
  name?: string;
  description?: string;
}

export interface User {
  name: string;
  _id: string;
  email: string;
  products: Product[];
  id: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {user , setUser, token} = useAuth();

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user and products on component mount
  useEffect(() => {
    console.log(user)
    console.log(token)
    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${user?.id}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log(response)
        setUser(response.data);
        console.log(user)
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [loading]);

  if (loading) {
    return  (
        <div className="loader-overlay">
        <div className="loader-spinner"></div>
            <p className="loader-text">Loading...</p>
        </div>
    )
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">No user data available</div>;
  }

  const totalPages = Math.ceil(user.products.length / itemsPerPage);
  const paginatedProducts = user.products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-100 py-10 profile">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Back to Home Arrow */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer mb-4 flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </div>

        {/* User Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
            {user.name[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-700">{product.title}</h2>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="text-blue-600 font-semibold mt-2">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
