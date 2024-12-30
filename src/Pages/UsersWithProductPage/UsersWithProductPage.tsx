import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../Profile/ProfilePage';
import { API_BASE_URL } from '../Auth/Auth';
import { useAuth } from '../../Route/Route';
import { useNavigate } from 'react-router-dom';


const UsersWithProductsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const {token, user} = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
      // Load saved theme from localStorage if available
      return localStorage.getItem('theme') === 'dark';
    });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${API_BASE_URL}/user/with-products`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users with products:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-5 hero">
      <h1 className="text-3xl font-bold text-center mb-8 text[#606072]">Users with Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((_user) => (
          <div
            key={_user._id}
            className={`${darkMode ? "bg-gray-800 border border-[rgb(42,45,50)]": "bg-white border border-gray-200 "} shadow-md rounded-lg p-5
             transition-transform transform hover:scale-105 
             hover:shadow-lg cursor-pointer`}
            onClick={() => navigate(`/chat/${user?.id}/${_user._id}`)}
          >
            <h2 className="text-xl font-semibold text-gray-800">{_user.email === user?.email ? "Me" : _user?.name}</h2>
            <p className="text-sm text-gray-600">{_user.email}</p>
            <div className="flex justify-center space-x-4 mb-6 p-2">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                {_user.name[0].toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersWithProductsPage;
