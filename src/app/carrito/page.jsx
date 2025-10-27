'use client';

import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Carrito() {
  const { cart, eliminarDelCarrito, actualizarCantidad, obtenerTotal, limpiarCarrito } = useCart();

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Carrito de Compras</h1>
          <Link 
            href="/productos"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Seguir Comprando
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-gray-700 mx-auto mb-6" />
            <p className="text-gray-400 text-xl mb-4">Tu carrito está vacío</p>
            <Link 
              href="/productos"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`} 
                  className="bg-gray-900 rounded-2xl p-6 flex gap-6 hover:bg-gray-800 transition-colors"
                >
                  {/* Image */}
                  <div className="w-32 h-32 bg-white rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-1">Talla: {item.size}</p>
                      <p className="text-white font-bold text-lg">
                        ${item.price.toLocaleString('es-CL')}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-3 bg-black rounded-full px-4 py-2">
                        <button
                          onClick={() => actualizarCantidad(item.id, item.size, item.quantity - 1)}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => actualizarCantidad(item.id, item.size, item.quantity + 1)}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => eliminarDelCarrito(item.id, item.size)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-2">Subtotal</p>
                    <p className="text-white font-bold text-xl">
                      ${(item.price * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={limpiarCarrito}
                className="text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                Limpiar Carrito
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-2xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Resumen</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Productos ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
                    <span>${obtenerTotal().toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white font-bold text-xl">
                      <span>Total</span>
                      <span>${obtenerTotal().toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-lg mb-3">
                  Proceder al Pago
                </button>

                <Link 
                  href="/productos"
                  className="block w-full text-center text-gray-400 hover:text-white transition-colors py-2"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
