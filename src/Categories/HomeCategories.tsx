import React from 'react';
import { useParams } from 'react-router-dom';




interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CategoryPageProps {
  products: Product[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ products }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
        //   <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
