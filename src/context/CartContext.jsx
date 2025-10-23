'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const obtenerCantidadTotal = () => {
        return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const agregarAlCarrito = (producto) => {
        setCart((prevCart) => {
            const existente = prevCart.find(item => item.id === producto.id);
            if (existente) {
                return prevCart.map(item =>
                    item.id === producto.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...producto, quantity: 1 }];
        });
    };

    const eliminarDelCarrito = (id) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, agregarAlCarrito, eliminarDelCarrito, obtenerCantidadTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
}
