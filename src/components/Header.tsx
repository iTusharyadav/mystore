import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, Search, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface HeaderProps {
  onCategorySearch: (query: string) => void;
  onBackToHome: () => void;
  isSearchActive: boolean;
  currentCategory: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onCategorySearch, 
  onBackToHome, 
  isSearchActive,
  currentCategory 
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartCount = useSelector((state: RootState) => state.cart.count);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  const handleCategoryClick = (category: string) => {
    setSearchTerm(category);
    setShowDropdown(false);
    onCategorySearch(category);
  };

  const handleBackClick = () => {
    setSearchTerm('');
    onBackToHome();
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSearchActive ? (
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="text-lg font-medium">Back</span>
              </button>
            ) : (
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
                <Store className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">MyStore</h1>
              </button>
            )}
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
                    onClick={() => handleCategoryClick(category)}
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
        {isSearchActive && currentCategory && (
          <div className="mt-2 text-sm text-gray-600">
            Showing results for: <span className="font-medium">{currentCategory}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;