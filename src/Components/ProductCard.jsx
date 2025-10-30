'use client';

import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function ProductCard({ product, index }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizes, setShowSizes] = useState(false);
  const { agregarAlCarrito } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizes(true);
      return;
    }
    agregarAlCarrito(product, selectedSize);
    setSelectedSize('');
    setShowSizes(false);
    
    // Mostrar feedback
    showToast(`${product.name} (Talla ${selectedSize}) agregado al carrito!`, 'success');
  };

  return (
    <div
      className="group relative bg-gray-50 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category Badge */}
      <div className="absolute top-8 right-8 bg-black text-white text-xs px-3 py-1 rounded-full">
        {product.category}
      </div>

      {/* Stock Badge */}
      {product.stock < 5 && (
        <div className="absolute top-8 left-8 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
          ¡Solo {product.stock}!
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-64 mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">
            {product.rating}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900">
          {product.name}
        </h3>

        {/* Size Selector */}
        {showSizes && (
          <div className="animate-fade-in">
            <p className="text-sm font-semibold text-gray-700 mb-2">Selecciona tu talla:</p>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toLocaleString('es-CL')}
          </span>
          <button 
            onClick={handleAddToCart}
            className="bg-black text-white p-3 rounded-full hover:scale-110 transition-transform duration-300 hover:bg-gray-800"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
