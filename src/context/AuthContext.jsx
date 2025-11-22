'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { registrarUsuario, loginUsuario, logoutUsuario } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario y token desde localStorage al iniciar
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        const userToken = localStorage.getItem('token');
        
        if (userData && userToken) {
            setUser(JSON.parse(userData));
            setToken(userToken);
        }
        setLoading(false);
    }, []);

    // Validar email
    const validarEmail = (email) => {
        const dominiosValidos = ['@gmail.com', '@duocuc.cl', '@profesorduoc.cl'];
        return dominiosValidos.some(dominio => email.endsWith(dominio));
    };

    // Validar contraseña
    const validarContrasena = (password) => {
        return password.length >= 8 && password.length <= 12;
    };

    // Registrar usuario
    const registrar = async (userData) => {
        const { nombre, email, password } = userData;
        
        // Validaciones
        if (!nombre || !email || !password) {
            throw new Error('Todos los campos son requeridos');
        }
        
        if (!validarEmail(email)) {
            throw new Error('Email debe terminar en @gmail.com, @duocuc.cl o @profesorduoc.cl');
        }
        
        if (!validarContrasena(password)) {
            throw new Error('La contraseña debe tener entre 8 y 12 caracteres');
        }
        
        try {
            // Registrar en el backend - confirmPassword se envía igual a password
            const response = await registrarUsuario({ nombre, email, password });
            
            console.log('=== RESPUESTA COMPLETA REGISTRO ===');
            console.log('Response:', response);
            console.log('Response.user:', response.user);
            console.log('Response.usuario:', response.usuario);
            console.log('Response.token:', response.token);
            console.log('===================================');
            
            // Guardar datos en localStorage
            // El backend Spring Boot devuelve el objeto en español: response.usuario
            const userSession = response.usuario || response.user || response;
            const sessionToken = response.token || response.session?.access_token;
            
            // Asegurar que tenga los campos necesarios
            const userData = {
                ...userSession,
                fechaRegistro: userSession.fechaRegistro || userSession.fecha_registro || userSession.createdAt || new Date().toISOString(),
                pedidos: userSession.pedidos || []
            };
            
            if (userData && sessionToken) {
                setUser(userData);
                setToken(sessionToken);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('token', sessionToken);
            }
            
            return response;
        } catch (error) {
            console.error('Error al registrar:', error);
            throw error;
        }
    };

    // Iniciar sesión
    const login = async (email, password) => {
        if (!validarEmail(email)) {
            throw new Error('Email debe terminar en @gmail.com, @duocuc.cl o @profesorduoc.cl');
        }
        
        try {
            // Login en el backend
            const response = await loginUsuario(email, password);
            
            console.log('=== RESPUESTA COMPLETA LOGIN ===');
            console.log('Response:', response);
            console.log('Response.user:', response.user);
            console.log('Response.usuario:', response.usuario);
            console.log('Response.token:', response.token);
            console.log('================================');
            
            // Guardar datos en localStorage
            // El backend Spring Boot devuelve el objeto en español: response.usuario
            const userSession = response.usuario || response.user || response;
            const sessionToken = response.token;
            
            // Asegurar que tenga los campos necesarios
            const userData = {
                ...userSession,
                fechaRegistro: userSession.fechaRegistro || userSession.fecha_registro || userSession.createdAt || new Date().toISOString(),
                pedidos: userSession.pedidos || []
            };
            
            if (userData && sessionToken) {
                setUser(userData);
                setToken(sessionToken);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('token', sessionToken);
            }
            
            return response;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    };

    // Cerrar sesión
    const logout = async () => {
        // No llamar al backend, solo limpiar localStorage
        setUser(null);
        setToken(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
    };

    // Agregar pedido al usuario
    const agregarPedido = (pedido) => {
        if (!user) return;
        
        const nuevoPedido = {
            id: Date.now().toString(),
            fecha: new Date().toISOString(),
            estado: 'Procesando',
            productos: pedido.productos,
            total: pedido.total,
            direccion: pedido.direccion,
            metodoEnvio: pedido.metodoEnvio
        };
        
        // Actualizar usuario actual
        const updatedUser = {
            ...user,
            pedidos: [...(user.pedidos || []), nuevoPedido]
        };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Actualizar en la base de usuarios
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const userIndex = usuarios.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            usuarios[userIndex].pedidos = updatedUser.pedidos;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
        
        return nuevoPedido;
    };

    // Actualizar estado del pedido
    const actualizarEstadoPedido = (pedidoId, nuevoEstado) => {
        if (!user) return;
        
        const pedidosActualizados = user.pedidos.map(pedido => 
            pedido.id === pedidoId 
                ? { ...pedido, estado: nuevoEstado }
                : pedido
        );
        
        const updatedUser = { ...user, pedidos: pedidosActualizados };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Actualizar en la base de usuarios
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const userIndex = usuarios.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            usuarios[userIndex].pedidos = pedidosActualizados;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    };

    const value = {
        user,
        token,
        loading,
        registrar,
        login,
        logout,
        agregarPedido,
        actualizarEstadoPedido,
        validarEmail,
        validarContrasena
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};