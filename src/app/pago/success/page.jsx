'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { crearPedido } from '../../../services/api';

function PagoExitosoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { limpiarCarrito } = useCart();
    const { user, token, loading: authLoading } = useAuth();
    const [procesando, setProcesando] = useState(true);
    const [error, setError] = useState(null);
    const [pedidoId, setPedidoId] = useState(null);

    useEffect(() => {
        // Esperar a que se cargue la autenticación
        if (authLoading) {
            console.log('Esperando autenticación...');
            return;
        }

        const procesarPago = async () => {
            try {
                // Obtener parámetros de Mercado Pago
                const paymentId = searchParams.get('payment_id');
                const status = searchParams.get('status');
                const externalReference = searchParams.get('external_reference');

                console.log('=== PAGO EXITOSO ===');
                console.log('Payment ID:', paymentId);
                console.log('Status:', status);
                console.log('External Reference:', externalReference);
                console.log('User:', user);
                console.log('Token presente:', !!token);
                
                // Debug localStorage
                console.log('=== DEBUG LOCALSTORAGE ===');
                console.log('userData en localStorage:', localStorage.getItem('userData'));
                console.log('token en localStorage:', localStorage.getItem('token'));
                console.log('pedidoPendiente en localStorage:', localStorage.getItem('pedidoPendiente'));

                // Recuperar datos del pedido pendiente
                const pedidoPendienteStr = localStorage.getItem('pedidoPendiente');
                
                // Si no hay user/token en context, intentar recuperarlos directamente de localStorage
                let currentUser = user;
                let currentToken = token;
                
                if (!currentUser || !currentToken) {
                    console.log('Intentando recuperar sesión de localStorage...');
                    const userDataStr = localStorage.getItem('userData');
                    const tokenStr = localStorage.getItem('token');
                    
                    if (userDataStr && tokenStr) {
                        currentUser = JSON.parse(userDataStr);
                        currentToken = tokenStr;
                        console.log('Sesión recuperada de localStorage:', currentUser);
                    } else {
                        console.error('No hay sesión en localStorage');
                        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
                        setProcesando(false);
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                        return;
                    }
                }
                
                if (pedidoPendienteStr) {
                    const pedidoPendiente = JSON.parse(pedidoPendienteStr);
                    
                    // Crear el pedido en el backend usando las variables recuperadas
                    const pedidoData = {
                        email: currentUser.email,
                        nombre: currentUser.nombre,
                        items: pedidoPendiente.items,
                        total: pedidoPendiente.total,
                        direccionEnvio: pedidoPendiente.direccionEnvio,
                        metodoPago: 'Mercado Pago'
                    };

                    console.log('Creando pedido en backend:', pedidoData);
                    
                    const response = await crearPedido(pedidoData, currentToken);
                    console.log('Pedido creado:', response);
                    
                    setPedidoId(response.id || pedidoPendiente.pedidoId);
                    
                    // Limpiar carrito y datos temporales
                    limpiarCarrito();
                    localStorage.removeItem('pedidoPendiente');
                }
                
                setProcesando(false);
                
                // Redirigir automáticamente después de 5 segundos
                setTimeout(() => {
                    router.push('/cuenta?tab=pedidos');
                }, 5000);
                
            } catch (error) {
                console.error('Error al procesar el pago exitoso:', error);
                setError(error.message);
                setProcesando(false);
            }
        };

        procesarPago();
    }, [searchParams, user, token, authLoading, limpiarCarrito, router]);

    if (procesando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Procesando tu pedido...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al procesar</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link 
                        href="/productos"
                        className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Icono de éxito */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        ¡Pago Exitoso!
                    </h1>

                    {/* Mensaje */}
                    <p className="text-lg text-gray-600 mb-2">
                        Tu pedido ha sido procesado correctamente
                    </p>
                    
                    {pedidoId && (
                        <p className="text-sm text-gray-500 mb-6">
                            Número de pedido: <span className="font-semibold text-gray-900">{pedidoId}</span>
                        </p>
                    )}

                    {/* Información adicional */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            ¿Qué sigue?
                        </h3>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Recibirás un correo de confirmación con los detalles de tu pedido</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Procesaremos tu pedido y te notificaremos cuando sea enviado</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>Podrás hacer seguimiento de tu pedido en tu cuenta</span>
                            </li>
                        </ul>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/cuenta?tab=pedidos"
                            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Ver mis pedidos
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/productos"
                            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300"
                        >
                            Seguir comprando
                        </Link>
                    </div>

                    {/* Auto-redirect mensaje */}
                    <p className="text-xs text-gray-500 mt-6">
                        Serás redirigido a tus pedidos en 5 segundos...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PagoExitosoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Cargando...</p>
                </div>
            </div>
        }>
            <PagoExitosoContent />
        </Suspense>
    );
}
