import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import HomePage from './pages/HomePage';
import { store } from './store';
import type { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [isStorePage, setIsStorePage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = category
        ? `https://fakestoreapi.com/products/category/${category}`
        : 'https://fakestoreapi.com/products';
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySearch = async (category: string) => {
    setCurrentCategory(category);
    setIsSearchActive(!!category);
    await fetchProducts(category);
  };

  const handleBackToHome = () => {
    setIsSearchActive(false);
    setCurrentCategory('');
    setIsStorePage(false);
  };

  const handleShowMore = () => {
    setIsStorePage(true);
  };

  if (!isStorePage) {
    return (
      <Provider store={store}>
        <HomePage onShowMore={handleShowMore} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <Header 
          onCategorySearch={handleCategorySearch}
          onBackToHome={handleBackToHome}
          isSearchActive={isSearchActive}
          currentCategory={currentCategory}
        />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </main>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </Provider>
  );
}

export default App