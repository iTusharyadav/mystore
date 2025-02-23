import React, { useEffect, useState } from 'react';
import { Store, ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Search, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProductModal from '../components/ProductModal';
import type { RootState } from '../store';
import type { Product } from '../types';

interface HomePageProps {
  onShowMore: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onShowMore }) => {
  const cartCount = useSelector((state: RootState) => state.cart.count);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=6')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleCategorySearch = async (category: string) => {
    setLoading(true);
    setIsSearchActive(true);
    setSearchTerm(category);
    setShowDropdown(false);
    
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setIsSearchActive(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isSearchActive) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="text-lg font-medium">Back to Home</span>
              </button>
              
              <div className="flex-1 max-w-xl mx-8 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by category..."
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {showDropdown && filteredCategories.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        onClick={() => handleCategorySearch(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pt-24 pb-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating.rate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* First Section - Welcome */}
      <section className="min-h-screen relative">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Store className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">MyStore</h1>
              </div>

              <div className="flex-1 max-w-xl mx-8 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by category..."
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {showDropdown && filteredCategories.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        onClick={() => handleCategorySearch(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to MyStore
            </h1>
            <h2 className="text-3xl text-blue-600 mb-8">
              Your Shopping Destination
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover an unparalleled shopping experience where quality meets convenience. 
              We curate the finest products across multiple categories to bring you a 
              selection that matches your lifestyle. From trendy fashion to cutting-edge 
              electronics, we're your one-stop destination for all things exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Second Section - Featured Products */}
      <section className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating.rate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={onShowMore}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Show More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>support@mystore.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>123 Store Street, City, Country</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button className="hover:text-blue-400">About Us</button></li>
                <li><button className="hover:text-blue-400">Privacy Policy</button></li>
                <li><button className="hover:text-blue-400">Terms & Conditions</button></li>
                <li><button className="hover:text-blue-400">FAQs</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <button className="hover:text-blue-400">
                  <Facebook className="h-6 w-6" />
                </button>
                <button className="hover:text-blue-400">
                  <Twitter className="h-6 w-6" />
                </button>
                <button className="hover:text-blue-400">
                  <Instagram className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2025 MyStore. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;