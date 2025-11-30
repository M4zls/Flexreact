'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../Components/Toast';

export default function Registro() {
  const { registrar } = useAuth();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  
  const [errores, setErrores] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else {
      const dominiosValidos = ['@gmail.com', '@duocuc.cl', '@profesorduoc.cl'];
      const emailValido = dominiosValidos.some(dominio => formData.email.endsWith(dominio));
      if (!emailValido) {
        nuevosErrores.email = 'Email debe terminar en @gmail.com, @duocuc.cl o @profesorduoc.cl';
      }
    }
    
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8 || formData.password.length > 12) {
      nuevosErrores.password = 'La contraseña debe tener entre 8 y 12 caracteres';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setLoading(true);
    
    try {
      await registrar(formData);
      showToast('¡Cuenta creada exitosamente!', 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 flex items-center justify-center">
      <ToastContainer />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Registro</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tu nombre"
            />
            {errores.nombre && (
              <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                errores.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Correo"
            />
            {errores.email && (
              <p className="text-red-500 text-sm mt-1">{errores.email}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Dominios válidos: @gmail.com, @duocuc.cl, @profesorduoc.cl
            </p>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                errores.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errores.password && (
              <p className="text-red-500 text-sm mt-1">{errores.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Entre 8 y 12 caracteres
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
