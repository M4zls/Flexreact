'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw } from 'lucide-react';
import { obtenerProductoPorId, obtenerProductos } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../Components/Toast';
import ProductCard from '../../Components/ProductCard';

export const dynamic = 'force-dynamic';

function ProductoDetalleContent() {
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
      try {
        const response = await obtenerProductoPorId(productId);
        
        if (!response) {
          console.error('Error al cargar producto');
          router.push('/productos');
          return;
        }

        // Si el backend envía tallas con stock, usarlas. Si no, usar tallas estándar
        // Formato backend: tallas: [{ talla: '38', stock: 5 }, { talla: '39', stock: 0 }, ...]
        const productWithSizes = {
          ...response,
          tallas: response.tallas && response.tallas.length > 0 
            ? response.tallas 
            : ['38', '39', '40', '41', '42', '43', '44', '45'].map(t => ({ talla: t, stock: 999 }))
        };
        
        setProduct(productWithSizes);

        // Obtener productos relacionados por categoría
        const allProducts = await obtenerProductos();
        if (Array.isArray(allProducts)) {
          const related = allProducts.filter(
            p => p.categoria === response.categoria && p.id !== response.id
          ).slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        router.push('/productos');
      } finally {
        setLoading(false);
      }
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
    // Solo validar talla si el producto tiene tallas disponibles
    if (product.tallas && product.tallas.length > 0 && !selectedSize) {
      showToast('Por favor selecciona una talla', 'warning');
      return;
    }

    const tallaSeleccionada = (product.tallas && product.tallas.length > 0) ? selectedSize : 'Única';

    // Agregar toda la cantidad de una vez
    agregarAlCarrito(product, tallaSeleccionada, quantity);

    const tallaTexto = (product.tallas && product.tallas.length > 0) ? ` (Talla ${tallaSeleccionada})` : '';
    showToast(`${quantity} ${product.nombre}${tallaTexto} agregado${quantity > 1 ? 's' : ''} al carrito!`, 'success');
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

  const images = [product.imagen];

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
                alt={product.nombre}
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
                      alt={`${product.nombre} ${idx + 1}`}
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
                {product.categoria}
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
                {product.nombre}
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
                  ${product.precio.toLocaleString('es-CL')}
                </span>
                {product.descuento && (
                  <>
                    <span className="text-gray-400 line-through text-sm sm:text-base">
                      ${Math.round(product.precio / (1 - product.descuento / 100)).toLocaleString('es-CL')}
                    </span>
                    <span className="bg-red-600 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                      -{product.descuento}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Precio incluye IVA
              </p>
            </div>

            {/* Selector de Talla */}
            {product.tallas && product.tallas.length > 0 && (
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
                  {product.tallas.map((tallaObj) => {
                    const talla = typeof tallaObj === 'string' ? tallaObj : tallaObj.talla;
                    const stock = typeof tallaObj === 'object' ? tallaObj.stock : 999;
                    const disponible = stock > 0;
                    
                    return (
                      <button
                        key={talla}
                        onClick={() => disponible && setSelectedSize(talla)}
                        disabled={!disponible}
                        className={`py-2 sm:py-3 px-2 sm:px-4 text-center font-medium rounded-lg border-2 transition-all text-sm sm:text-base relative ${
                          !disponible
                            ? 'border-gray-800 text-gray-600 cursor-not-allowed bg-gray-900'
                            : selectedSize === talla
                              ? 'border-white bg-white text-black'
                              : 'border-gray-700 text-white hover:border-gray-500'
                        }`}
                      >
                        {talla}
                        {!disponible && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-0.5 bg-red-500 rotate-45"></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Las tallas tachadas no tienen stock disponible
                </p>
              </div>
            )}

            {/* Stock y Cantidad */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-semibold text-sm sm:text-base">
                  Cantidad:
                </label>
                <span className="text-green-400 text-xs sm:text-sm font-medium">
                  {product.stock} disponibles en stock
                </span>
              </div>
              <div className="flex items-center bg-gray-900 rounded-lg w-fit">
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
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className={`px-3 sm:px-4 py-2 rounded-r-lg transition-colors ${
                    quantity >= product.stock 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  +
                </button>
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

export default function ProductoDetalle() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 px-4 sm:px-6 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando producto...</p>
        </div>
      </div>
    }>
      <ProductoDetalleContent />
    </Suspense>
  );
}
