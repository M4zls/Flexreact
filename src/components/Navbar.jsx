﻿'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { obtenerCantidadTotal } = useCart();
    const cantidadProductos = obtenerCantidadTotal();

    return (
        <header className="w-full fixed top-4 z-50 px-4">
            <nav className="max-w-6xl mx-auto bg-black/90 backdrop-blur-md rounded-full border border-white/10 px-10 shadow-lg shadow-black/20">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-4">
                        <img 
                            src="/Img/Gemini_Generated_Image_boosgqboosgqboos.svg" 
                            alt="Logo" 
                            className="w-18 h-18 brightness-0 invert"
                        />
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                        <Link href="/" className="text-[13px] text-gray-300 hover:text-white transition-colors">
                            Inicio
                        </Link>
                        <Link href="/productos" className="text-[16px] text-gray-300 hover:text-white transition-colors">
                            Productos
                        </Link>
                        <Link href="/nosotros" className="text-[16px] text-gray-300 hover:text-white transition-colors">
                            Nosotros
                        </Link>
                        <Link href="/blog" className="text-[16px] text-gray-300 hover:text-white transition-colors">
                            Blog
                        </Link>
                        <Link href="/contacto" className="text-[16px] text-gray-300 hover:text-white transition-colors">
                            Contacto
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login" className="text-[14px] text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link 
                                href="/registro" 
                                className="text-[14px] bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors font-medium"
                            >
                                Registro
                            </Link>
                        </div>
                        
                        <Link href="/carrito" className="relative text-gray-300 hover:text-white transition-colors">
                            <ShoppingCart className="w-[18px] h-[18px]" />
                            {cantidadProductos > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                    {cantidadProductos}
                                </span>
                            )}
                        </Link>
                        
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-gray-300 hover:text-white transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>
            {isOpen && (
                <div className="md:hidden mt-2 max-w-5xl mx-auto bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 px-6 py-3 space-y-1 shadow-lg shadow-black/20">
                    <Link href="/" className="block text-[13px] text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                        Inicio
                    </Link>
                    <Link href="/productos" className="block text-[13px] text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                        Productos
                    </Link>
                    <Link href="/nosotros" className="block text-[13px] text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                        Nosotros
                    </Link>
                    <Link href="/blog" className="block text-[13px] text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                        Blog
                    </Link>
                    <Link href="/contacto" className="block text-[13px] text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                        Contacto
                    </Link>
                    <div className="border-t border-white/10 mt-2 pt-2 space-y-2">
                        <Link href="/login" className="block text-[13px] text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                            Login
                        </Link>
                        <Link 
                            href="/registro" 
                            className="block text-center text-[13px] bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Registro
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
