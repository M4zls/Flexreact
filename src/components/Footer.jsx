﻿export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white py-12 mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MokkiCoffee</h3>
            <p className="text-gray-300 text-sm">
              Las mejores zapatillas premium en Chile
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/productos" className="text-gray-300 hover:text-white transition-colors">Productos</a></li>
              <li><a href="/nosotros" className="text-gray-300 hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Síguenos</h3>
            <p className="text-gray-300 text-sm">
              Mantente conectado con nosotros en redes sociales
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MokkiCoffee — Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
