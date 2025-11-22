'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { obtenerProductos } from '../services/api';
import ProductCard from '../Components/ProductCard';

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await obtenerProductos();
        // Filtrar solo productos con descuento
        const discountedProducts = Array.isArray(response) 
          ? response.filter(p => p.descuento && p.descuento > 0)
          : [];
        setProducts(discountedProducts);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
        <div className="absolute w-full h-32 sm:h-[20rem] bg-gradient-to-b from-transparent to-black z-20 bottom-0 left-0"></div>
        <div className="absolute inset-0 opacity-25 sm:opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-3xl z-10 animate-pulse animation-delay-3000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-3xl animate-pulse z-10 animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[80px] sm:blur-3xl animate-pulse z-10 animation-delay-4000"></div>
        </div>
        
        <div className="absolute inset-0 opacity-5 sm:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center px-5 sm:px-6 max-w-5xl mx-auto z-20">
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 sm:mb-6 animate-fade-in leading-tight">
            Forma tu pasos hacia
            <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              El Futuro
            </span>
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-gray-300 mb-5 sm:mb-8 animate-fade-in-delay px-2">
            Descubre nuestro catálogo con los mejores pares de chile
          </p>
          <Link 
            href="/productos" 
            className="inline-flex items-center gap-2 bg-white text-black px-5 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 text-xs sm:text-base animate-fade-in-delay-2"
          >
            Ver Colección
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

    
      <section className="py-8 sm:py-16 md:py-20 px-3 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-4">
              Productos En Oferta
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <p className="text-white text-xs sm:text-base">Cargando productos...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="relative">
              {/* Botón Anterior */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all hover:scale-110 -ml-4"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Carrusel */}
              <div className="overflow-hidden px-8">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0 flex gap-4">
                      {products
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((product, index) => (
                          <div key={product.id} className="w-1/2">
                            <ProductCard product={product} index={index} />
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all hover:scale-110 -mr-4"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicadores */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-lg">No hay productos con descuento disponibles</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-white font-semibold hover:gap-4 transition-all duration-300"
            >
              Ver todos los productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>


      <section className="py-8 sm:py-16 md:py-20 px-3 sm:px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center relative z-50">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-6">
            Únete a nuestra comunidad
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 mb-4 sm:mb-8 px-2">
            Recibe ofertas exclusivas y sé el primero en conocer nuevos lanzamientos
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-white text-black px-5 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 text-xs sm:text-base"
          >
            Registrarse Ahora
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </Link>
        </div>
        <div className="absolute w-full h-40 sm:h-[20rem] bg-gradient-to-b from-purple-900/40 to-transparent z-20 bottom-0 left-0"></div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
