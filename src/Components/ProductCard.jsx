'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function ProductCard({ product, index }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizes, setShowSizes] = useState(false);
  const { agregarAlCarrito } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/info?id=${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedSize) {
      setShowSizes(true);
      return;
    }
    agregarAlCarrito(product, selectedSize);
    setSelectedSize('');
    setShowSizes(false);
    
    // Mostrar feedback
    showToast(`${product.nombre} (Talla ${selectedSize}) agregado al carrito!`, 'success');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-gray-50 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up cursor-pointer mobile-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category Badge */}
      <div className="absolute top-8 right-8 bg-black text-white text-xs px-3 py-1 rounded-full mobile-badge">
        {product.categoria}
      </div>

      {/* Discount Badge */}
      {product.descuento && (
        <div className="absolute top-8 left-8 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold mobile-badge">
          -{product.descuento}%
        </div>
      )}

      {/* Stock Badge */}
      {product.stock < 5 && !product.descuento && (
        <div className="absolute top-8 left-8 bg-red-500 text-white text-xs px-3 py-1 rounded-full mobile-badge">
          ¡Solo {product.stock}!
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-64 mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mobile-image">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 mobile-title">
          {product.nombre}
        </h3>

        {/* Size Selector */}
        {showSizes && (
          <div className="animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold text-gray-700 mb-2 mobile-size-label">Selecciona tu talla:</p>
            <div className="grid grid-cols-4 gap-2 mobile-size-grid">
              {product.tallas.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`py-2 px-3 text-sm font-medium rounded-lg border-2 transition-all mobile-size-button ${
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
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 mobile-price">
              ${product.precio.toLocaleString('es-CL')}
            </span>
            {product.descuento && (
              <span className="text-sm text-gray-500 line-through mobile-old-price">
                ${Math.round(product.precio / (1 - product.descuento / 100)).toLocaleString('es-CL')}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-black text-white p-3 rounded-full hover:scale-110 transition-transform duration-300 hover:bg-gray-800 mobile-cart-button"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .mobile-card {
            padding: 0.875rem;
            border-radius: 1rem;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .mobile-badge {
            display: none;
          }
          
          .mobile-image {
            height: 10rem;
            margin-bottom: 0.75rem;
            border-radius: 0.75rem;
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          }
          
          .mobile-image img {
            padding: 0.75rem;
          }
          
          .mobile-title {
            font-size: 0.8125rem;
            line-height: 1.125rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 2.25rem;
          }
          
          .mobile-size-label {
            font-size: 0.6875rem;
            margin-bottom: 0.375rem;
          }
          
          .mobile-size-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.25rem;
          }
          
          .mobile-size-button {
            padding: 0.3125rem 0.375rem;
            font-size: 0.6875rem;
            border-radius: 0.375rem;
          }
          
          .mobile-price {
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          
          .mobile-old-price {
            font-size: 0.6875rem;
            margin-top: 0.125rem;
          }
          
          .mobile-cart-button {
            padding: 0.5rem;
            border-radius: 0.625rem;
          }
          
          .mobile-cart-button svg {
            width: 0.875rem;
            height: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
