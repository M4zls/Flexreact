'use client';

import { useCart } from '../context/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartDropdown({ isOpen, onClose }) {
  const { cart, eliminarDelCarrito, actualizarCantidad, obtenerTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Mi Carrito
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-2">¡Agrega algunos productos!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`} 
                  className="flex gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {item.nombre}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">Talla: {item.size}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      ${item.precio.toLocaleString('es-CL')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => eliminarDelCarrito(item.id, item.size)}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-semibold">Total:</span>
              <span className="text-xl font-bold text-gray-900">
                ${obtenerTotal().toLocaleString('es-CL')}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/pago"
                onClick={onClose}
                className="block w-full bg-red-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-red-700 transition-all hover:shadow-lg"
              >
                Proceder al Pago
              </Link>
              <Link
                href="/carrito"
                onClick={onClose}
                className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-xl font-medium hover:bg-gray-300 transition-colors text-sm"
              >
                Ver Carrito Completo
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
