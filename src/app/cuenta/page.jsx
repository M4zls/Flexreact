'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Calendar, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../Components/ConfirmModal';
import { actualizarEstadosAleatorios } from '../../utils/estadosPedidos';

export default function Cuenta() {
  const { user, logout, loading, actualizarEstadoPedido } = useAuth();
  const router = useRouter();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isClient, setIsClient] = useState(false);

  // Asegurar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
    // Solo después de montar en el cliente, leer los parámetros URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Simular cambios de estado de pedidos
  useEffect(() => {
    if (user && user.pedidos && user.pedidos.length > 0) {
      actualizarEstadosAleatorios(user.pedidos, actualizarEstadoPedido);
    }
  }, [user, actualizarEstadoPedido]);

  // Mostrar loading mientras se carga
  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu cuenta...</p>
        </div>
      </div>
    );
  }

  // Redirigir si no hay usuario
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar',
      type: 'warning'
    });
    
    if (confirmed) {
      logout();
      router.push('/');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'procesando':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'enviado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <ConfirmDialog />
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{user.nombre}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeTab === 'perfil' 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Perfil
                </button>
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeTab === 'pedidos' 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Mis Pedidos
                  {user.pedidos && user.pedidos.length > 0 && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {user.pedidos.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'perfil' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={user.nombre}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de registro
                    </label>
                    <input
                      type="text"
                      value={formatearFecha(user.fechaRegistro || new Date())}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
                  
                  {!user.pedidos || user.pedidos.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aún no tienes pedidos
                      </h3>
                      <p className="text-gray-600 mb-6">
                        ¡Explora nuestros productos y realiza tu primera compra!
                      </p>
                      <Link 
                        href="/productos"
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Ver Productos
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.pedidos.map((pedido) => (
                        <div key={pedido.id} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <div className="mb-4 lg:mb-0">
                              <h3 className="font-semibold text-gray-900">
                                Pedido #{pedido.id.slice(-6)}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatearFecha(pedido.fecha)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {pedido.direccion?.ciudad || 'Dirección no disponible'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 border rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                                {pedido.estado}
                              </span>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  ${pedido.total?.toLocaleString('es-CL') || '0'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {pedido.productos?.length || 0} producto(s)
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {pedido.productos && pedido.productos.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">Productos:</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {pedido.productos.map((producto, index) => (
                                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                      <img
                                        src={producto.imagen || '/placeholder.jpg'}
                                        alt={producto.nombre || 'Producto'}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          if (e.target instanceof HTMLImageElement) {
                                            e.target.style.display = 'none';
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-gray-900 truncate">
                                        {producto.nombre || 'Producto'}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Talla: {producto.size || 'N/A'} | Qty: {producto.quantity || 1}
                                      </p>
                                      <p className="text-sm font-semibold text-gray-900">
                                        ${((producto.precio || 0) * (producto.quantity || 1)).toLocaleString('es-CL')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

