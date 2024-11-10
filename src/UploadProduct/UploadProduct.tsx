import React, { useState } from 'react';
import axios from 'axios';
import './UploadProduct.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Auth/Auth';
import { useAuth } from '../Route/Route';

const UploadProductPage: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // Validate the form fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!productName) newErrors.productName = 'Product name is required';
    if (!price) newErrors.price = 'Price is required';
    else if (isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Price must be a positive number';
    if (!category) newErrors.category = 'Category is required';
    if (!image) newErrors.image = 'Product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image selection and set preview URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a URL for the selected image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', price);
      formData.append('category', category);
      if (image) formData.append('image', image);

      try {
        const response = await axios.post(`${API_BASE_URL}/products/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setMessage('Product uploaded successfully!');
        setTimeout(() => navigate('/profile'), 2000);
        setIsUploading(false);
      } catch (error) {
        console.error(error);
        setMessage('Failed to upload product.');
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 upload-container">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Upload Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.productName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter product name"
            />
            {errors.productName && <p className="mt-1 text-sm text-red-500">{errors.productName}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter price in $"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="" disabled>Select category</option>
              <option value="Accessories">Accessories</option>
              <option value="Clothes">Clothes</option>
              <option value="Electronics">Electronics</option>
              <option value="Shoes">Shoes</option>
              <option value="Bags">Bags</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 ${errors.image ? 'border-red-500' : ''}`}
            />
            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center`}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="button-loader"></div>
              ) : (
                "Upload Product"
              )}
            </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-white text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 hover:text-gray-900 transition duration-200"
          >
            Back To Home
          </button>
        </form>

        {message && <p className="text-center text-sm text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default UploadProductPage;
