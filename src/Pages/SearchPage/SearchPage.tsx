import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Auth/Auth';
import axios from 'axios';
import { useAuth } from '../../Route/Route';
import { Product } from '../Profile/ProfilePage';
import { Category } from '../Home/HomePage';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', priceRange: [0, 1000] });
  const [searchResults, setSearchResults] = useState<Product[]>([]); // Replace with actual result type
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {token} = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log(query)
      console.log(filters)
      // console.log()
      const response = await axios.get(
        `${API_BASE_URL}/products/search?query=${query}&category=${filters.category}&priceRange[]=${filters.priceRange[0]}&priceRange[]=${filters.priceRange[1]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
        const products = response.data;
       
         // Group products by category and get the first product's image for each category
         const groupedCategories = response.data.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = product.imageUrl; // Store the first product's image for the category
          }
          return acc;
        }, {} as { [key: string]: string });

        const _id = 0;
        // Convert the grouped object into an array of Category objects
        const categoriesArray = Object.entries(groupedCategories).map(([name, imageUrl]) => ({
          name,
          imageUrl,
          id: _id + 1, // Assign unique IDs to each category
        }));
        console.log(categoriesArray)
        setCategories(categoriesArray);
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8 flex flex-col items-center hero">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
      <button
        onClick={() => window.location.href = `http://localhost:5173/`}
        className="ml-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
        Home
      </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                placeholder="Search for products..."
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center justify-center bg-blue-600 rounded-lg p-2 hover:bg-blue-700 ml-4 focus:outline-none"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full mt-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
            >
              <option value="">All Categories</option>
              {
                categories.map((category) => {
                  return <option key={category.id} value={category.name}>{category.name}</option>
                })
              }
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price Range</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
              }
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Search Results Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Search Results</h2>
          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300">No results found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {searchResults.map((product, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                  <div className="mt-4">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">${product.price}</span>
                    <button
                      onClick={() => window.location.href = `http://localhost:5173/category/Accessories/${product._id}`}
                      className="ml-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
