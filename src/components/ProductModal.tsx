import React from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import type { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[400px] object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {product.title}
            </h2>
            
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <div className="ml-4 flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-gray-600">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;