'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';

function PagoPendienteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Obtener parámetros de Mercado Pago
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        
        console.log('=== PAGO PENDIENTE ===');
        console.log('Payment ID:', paymentId);
        console.log('Status:', status);
        console.log('====================');

        // Auto-redirect después de 10 segundos
        const timer = setTimeout(() => {
            router.push('/cuenta?tab=pedidos');
        }, 10000);

        return () => clearTimeout(timer);
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Icono de pendiente */}
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-yellow-600 animate-pulse" />
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Pago Pendiente
                    </h1>

                    {/* Mensaje */}
                    <p className="text-lg text-gray-600 mb-6">
                        Tu pago está siendo procesado
                    </p>

                    {/* Información adicional */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
                        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            ¿Qué significa esto?
                        </h3>
                        <div className="space-y-3 text-sm text-yellow-800">
                            <p>
                                Tu pago está en proceso de verificación. Esto puede deberse a:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 mt-0.5">•</span>
                                    <span>Elegiste pagar en efectivo y aún no se ha acreditado el pago</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 mt-0.5">•</span>
                                    <span>Tu banco está verificando la transacción</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 mt-0.5">•</span>
                                    <span>El medio de pago requiere confirmación adicional</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Próximos pasos */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                        <h3 className="font-semibold text-blue-900 mb-3">
                            Próximos pasos
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">1.</span>
                                <span>Te enviaremos un correo cuando tu pago sea confirmado</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">2.</span>
                                <span>Puedes revisar el estado de tu pedido en tu cuenta</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">3.</span>
                                <span>Si pagaste en efectivo, asegúrate de completar el pago según las instrucciones recibidas</span>
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
                        Serás redirigido a tus pedidos en 10 segundos...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PagoPendientePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Cargando...</p>
                </div>
            </div>
        }>
            <PagoPendienteContent />
        </Suspense>
    );
}
