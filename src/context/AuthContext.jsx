'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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
    const [loading, setLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
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
    const registrar = (userData) => {
        const { nombre, email, password, confirmPassword } = userData;
        
        // Validaciones
        if (!nombre || !email || !password || !confirmPassword) {
            throw new Error('Todos los campos son requeridos');
        }
        
        if (!validarEmail(email)) {
            throw new Error('Email debe terminar en @gmail.cl, @duocuc.cl o @profesorduoc.cl');
        }
        
        if (!validarContrasena(password)) {
            throw new Error('La contraseña debe tener entre 8 y 12 caracteres');
        }
        
        if (password !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }
        
        // Verificar si el usuario ya existe
        const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios') || '[]');
        if (usuariosExistentes.find(u => u.email === email)) {
            throw new Error('Ya existe una cuenta con este email');
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            id: Date.now().toString(),
            nombre,
            email,
            password,
            fechaRegistro: new Date().toISOString(),
            pedidos: []
        };
        
        // Guardar en localStorage
        usuariosExistentes.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes));
        
        // Login automático
        const userSession = { 
            id: nuevoUsuario.id, 
            nombre: nuevoUsuario.nombre, 
            email: nuevoUsuario.email,
            pedidos: nuevoUsuario.pedidos
        };
        setUser(userSession);
        localStorage.setItem('userData', JSON.stringify(userSession));
        
        return nuevoUsuario;
    };

    // Iniciar sesión
    const login = (email, password) => {
        if (!validarEmail(email)) {
            throw new Error('Email debe terminar en @gmail.cl, @duocuc.cl o @profesorduoc.cl');
        }
        
        const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuariosExistentes.find(u => u.email === email && u.password === password);
        
        if (!usuario) {
            throw new Error('Email o contraseña incorrectos');
        }
        
        const userSession = { 
            id: usuario.id, 
            nombre: usuario.nombre, 
            email: usuario.email,
            pedidos: usuario.pedidos || []
        };
        setUser(userSession);
        localStorage.setItem('userData', JSON.stringify(userSession));
        
        return usuario;
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userData');
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