'use client';

import { products } from '../../data/products.js';
import ProductCard from '../../Components/ProductCard.jsx';

export default function ProductosPage() {
  return (
    <div className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Nuestra Colección de Zapatillas
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
