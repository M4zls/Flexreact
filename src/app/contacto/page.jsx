'use client';

import { Mail, MapIcon, Phone } from "lucide-react";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Contáctanos</h1>
          <p className="text-gray-300 text-lg">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <form className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-white mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-white mb-2">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <Mail className="text-white text-3xl mb-3 w-8 h-8 mx-auto"></Mail>
            <h3 className="text-white font-semibold mb-2">Email</h3>
            <p className="text-gray-400 text-sm">contacto@flex.cl</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <Phone className="text-white text-3xl mb-3 w-8 h-8 mx-auto"></Phone>
            <h3 className="text-white font-semibold mb-2">Teléfono</h3>
            <p className="text-gray-400 text-sm">+56 9 1234 5678</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <MapIcon className="text-white text-3xl mb-3 w-8 h-8 mx-auto"></MapIcon>
            <h3 className="text-white font-semibold mb-2">Ubicación</h3>
            <p className="text-gray-400 text-sm">Santiago, Chile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
