'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext({
    cart: [],
    obtenerCantidadTotal: () => 0,
    obtenerTotal: () => 0,
    agregarAlCarrito: (producto, size, cantidad = 1) => {},
    eliminarDelCarrito: (id, size) => {},
    actualizarCantidad: (id, size, cantidad) => {},
    limpiarCarrito: () => {}
});

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const obtenerCantidadTotal = () => {
        return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const obtenerTotal = () => {
        return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    const agregarAlCarrito = (producto, size, cantidad = 1) => {
        setCart((prevCart) => {
            const existente = prevCart.find(item => item.id === producto.id && item.size === size);
            if (existente) {
                return prevCart.map(item =>
                    item.id === producto.id && item.size === size
                        ? { ...item, quantity: item.quantity + cantidad }
                        : item
                );
            }
            return [...prevCart, { ...producto, size, quantity: cantidad }];
        });
    };

    const eliminarDelCarrito = (id, size) => {
        setCart((prevCart) => prevCart.filter(item => !(item.id === id && item.size === size)));
    };

    const actualizarCantidad = (id, size, cantidad) => {
        setCart((prevCart) => 
            prevCart.map(item =>
                item.id === id && item.size === size
                    ? { ...item, quantity: Math.max(1, cantidad) }
                    : item
            )
        );
    };

    const limpiarCarrito = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            agregarAlCarrito, 
            eliminarDelCarrito, 
            obtenerCantidadTotal,
            obtenerTotal,
            actualizarCantidad,
            limpiarCarrito
        }}>
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
