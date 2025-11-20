'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw } from 'lucide-react';
import { getProductById, getProductsByCategory } from '../../supabase/queries';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../Components/Toast';
import ProductCard from '../../Components/ProductCard';

export const dynamic = 'force-dynamic';

export default function ProductoDetalle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { agregarAlCarrito } = useCart();
  const { showToast, ToastContainer } = useToast();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productId = searchParams.get('id');

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        router.push('/productos');
        return;
      }

      setLoading(true);
      const { data, error } = await getProductById(productId);
      
      if (error || !data) {
        console.error('Error al cargar producto:', error);
        router.push('/productos');
        return;
      }

      setProduct(data);

      const { data: related } = await getProductsByCategory(data.category);
      if (related) {
        setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 3));
      }

      setLoading(false);
    }

    fetchProduct();
  }, [productId, router]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Cargando producto...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Por favor selecciona una talla', 'warning');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      agregarAlCarrito(product, selectedSize);
    }

    showToast(`${quantity} ${product.name} (Talla ${selectedSize}) agregado${quantity > 1 ? 's' : ''} al carrito!`, 'success');
    setSelectedSize('');
    setQuantity(1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(
      isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      'success'
    );
  };

  const images = [product.image];

  return (
    <div className="min-h-screen bg-black pt-20 sm:pt-28 pb-8 sm:pb-16">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/productos"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a productos</span>
            <span className="sm:hidden">Volver</span>
          </Link>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4 sm:p-8"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`bg-gray-900 rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-white'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="space-y-4 sm:space-y-6">
            {/* Categoría y Favorito */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {product.category}
              </span>
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-900 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              </button>
            </div>

            {/* Nombre */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-medium text-sm sm:text-base">★★★★★</span>
                <span className="text-gray-400 text-sm sm:text-base">(128 reseñas)</span>
              </div>
            </div>

            {/* Precio */}
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  ${product.price.toLocaleString('es-CL')}
                </span>
                {product.discount && (
                  <>
                    <span className="text-gray-400 line-through text-sm sm:text-base">
                      ${Math.round(product.price / (1 - product.discount / 100)).toLocaleString('es-CL')}
                    </span>
                    <span className="bg-red-600 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Precio incluye IVA
              </p>
            </div>

            {/* Selector de Talla */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-semibold text-sm sm:text-base">
                  Selecciona tu talla:
                </label>
                <button className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Guía de tallas
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 sm:py-3 px-2 sm:px-4 text-center font-medium rounded-lg border-2 transition-all text-sm sm:text-base ${
                      selectedSize === size
                        ? 'border-white bg-white text-black'
                        : 'border-gray-700 text-white hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-white font-semibold mb-3 block text-sm sm:text-base">
                Cantidad:
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center bg-gray-900 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2 text-white hover:bg-gray-800 rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 sm:px-6 py-2 text-white font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 sm:px-4 py-2 text-white hover:bg-gray-800 rounded-r-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">
                  (Máximo 10 unidades)
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Agregar al Carrito
              </button>
              <Link
                href="/pago"
                onClick={() => {
                  if (selectedSize) {
                    handleAddToCart();
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Comprar Ahora
              </Link>
            </div>

            {/* Características */}
            <div className="border-t border-gray-800 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Características:
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Garantía de Autenticidad</p>
                    <p className="text-xs sm:text-sm text-gray-400">100% productos originales</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">Devolución Fácil</p>
                    <p className="text-xs sm:text-sm text-gray-400">30 días para cambios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-800 pt-12 sm:pt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
