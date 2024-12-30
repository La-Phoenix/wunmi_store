import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Auth/Auth';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email,
      });
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setError(err.response.data.message  || err.message|| 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 auth">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h1>
        {success ? (
          <div className="text-green-600 text-center">
            <p>A password reset link has been sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Reset Link
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/auth" className="text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
