'use client';

import { useState, useEffect } from 'react';
import { obtenerProductos } from '../../services/api';
import ProductCard from '../../Components/ProductCard.jsx';
import { useToast } from '../../Components/Toast';

export default function ProductosPage() {
  const { ToastContainer } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await obtenerProductos();
        setProducts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-28 px-3 sm:px-6 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <div className="text-white text-sm sm:text-xl">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 px-3 sm:px-6 bg-black pb-6 sm:pb-12">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-12 text-center">
          Nuestra Colección de Zapatillas
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
