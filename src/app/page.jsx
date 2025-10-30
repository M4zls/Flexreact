'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../Components/ProductCard';

export default function Page() {
  return (
    <div>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black relative ">
        <div className=" absolute w-full h-[20rem] bg-gradient-to-b from-transparent to-black z-20 bottom-0 left-0 "> </div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl z-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob z-10 animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob z-10 animation-delay-4000"></div>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '120px 120px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center px-50 max-w-5xl mx-auto z-20">
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
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 z-999 animate-fade-in-delay-2"
          >
            Ver Colección
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Productos Destacados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
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


      <section className="py-[66px] px-6 bg-black relative">
        <div className="max-w-4xl mx-auto text-center relative z-50">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Únete a nuestra comunidad
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Recibe ofertas exclusivas y sé el primero en conocer nuevos lanzamientos
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-white text-black px-8  py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Registrarse Ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute w-full  h-[20rem] bg-gradient-to-t from-[#4e179a56] to-transparent z-20 top-0 left-0"></div>
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
