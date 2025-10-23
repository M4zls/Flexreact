'use client';

import { useCart } from '../../context/CartContext';

export default function Carrito() {
  const { cart, eliminarDelCarrito } = useCart();

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <button
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
