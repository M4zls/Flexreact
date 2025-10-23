'use client';

import Link from 'next/link';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';

export default function Page() {
  const products = [
    {
      id: 1,
      name: "Nike Air Force 1 '07",
      price: 89990,
      image: "/Img/Gemini_Generated_Image_boosgqboosgqboos.svg",
      rating: 4.9,
      category: "Lifestyle"
    },
    {
      id: 2,
      name: "Nike Air Max 90",
      price: 109990,
      image: "/Img/Gemini_Generated_Image_boosgqboosgqboos.svg",
      rating: 4.8,
      category: "Lifestyle"
    },
    {
      id: 3,
      name: "Nike Pegasus 40",
      price: 119990,
      image: "/Img/Gemini_Generated_Image_boosgqboosgqboos.svg",
      rating: 4.7,
      category: "Running"
    },
    {
      id: 4,
      name: "Nike Dunk Low",
      price: 99990,
      image: "/Img/Gemini_Generated_Image_boosgqboosgqboos.svg",
      rating: 4.8,
      category: "Lifestyle"
    },
    {
      id: 5,
      name: "Nike Air Jordan 1 Mid",
      price: 129990,
      image: "/Img/Gemini_Generated_Image_boosgqboosgqboos.svg",
      rating: 4.9,
      category: "Basketball"
    },
    {
      id: 6,
      name: "Nike Mercurial Superfly",
      price: 149990,
      image: "/Img/Gemini_Generated_Image_boosgqboosgqboos.svg",
      rating: 4.6,
      category: "Fútbol"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '120px 120px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center px-50 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
            Forma tu camino hacia
            <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              El Futuro
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-delay">
            Descubre nuestro catalogo con las mejores marcas en chile
          </p>
          <Link 
            href="/productos" 
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 animate-fade-in-delay-2"
          >
            Ver Colección
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Productos Destacados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-gray-50 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Category Badge */}
                <div className="absolute top-8 right-8 bg-black text-white text-xs px-3 py-1 rounded-full">
                  {product.category}
                </div>

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

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toLocaleString('es-CL')}
                    </span>
                    <button className="bg-black text-white p-3 rounded-full hover:scale-110 transition-transform duration-300">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Únete a nuestra comunidad
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Recibe ofertas exclusivas y sé el primero en conocer nuevos lanzamientos
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Registrarse Ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
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
