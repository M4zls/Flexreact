'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PagoFallidoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Obtener parámetros de Mercado Pago
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        
        console.log('=== PAGO FALLIDO ===');
        console.log('Payment ID:', paymentId);
        console.log('Status:', status);
        console.log('===================');
    }, [searchParams]);

    const handleIntentarNuevamente = () => {
        // Volver a la página de pago para reintentar
        router.push('/pago');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Icono de error */}
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Pago Rechazado
                    </h1>

                    {/* Mensaje */}
                    <p className="text-lg text-gray-600 mb-6">
                        No pudimos procesar tu pago
                    </p>

                    {/* Razones comunes */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-left">
                        <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Razones comunes del rechazo
                        </h3>
                        <ul className="space-y-2 text-sm text-red-800">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>Fondos insuficientes en tu cuenta</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>Datos de la tarjeta incorrectos o vencida</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>Tu banco rechazó la transacción por seguridad</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>Límite de compra excedido</span>
                            </li>
                        </ul>
                    </div>

                    {/* Qué hacer */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                        <h3 className="font-semibold text-blue-900 mb-3">
                            ¿Qué puedes hacer?
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Verifica que tu tarjeta tenga fondos suficientes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Confirma que los datos ingresados sean correctos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Intenta con otro método de pago</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Contacta a tu banco para autorizar la compra</span>
                            </li>
                        </ul>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleIntentarNuevamente}
                            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Intentar nuevamente
                        </button>
                        <Link
                            href="/carrito"
                            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver al carrito
                        </Link>
                    </div>

                    {/* Ayuda adicional */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                            ¿Necesitas ayuda?
                        </p>
                        <Link
                            href="/contacto"
                            className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                        >
                            Contáctanos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
