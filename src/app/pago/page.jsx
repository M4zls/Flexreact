'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../Components/Toast';
import { crearPedido, crearPreferenciaMercadoPago } from '../../services/api';
import { 
    metodosEnvio, 
    initialFormData, 
    initialErrores 
} from '../../data/pago';
import {
    CarritoVacio,
    PagoExitoso,
    InformacionPersonal,
    DireccionEnvio,
    MetodoEnvio,
    InformacionPago,
    ResumenPedido
} from '../../Components/PagoComponents';

export default function PagoPage() {
    // Hooks
    const router = useRouter();
    const { cart, obtenerTotal, limpiarCarrito } = useCart();
    const { user, token, agregarPedido } = useAuth();
    const { showToast, ToastContainer } = useToast();
    
    // Estados
    const [loading, setLoading] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [pagoCompletado, setPagoCompletado] = useState(false);
    const [formData, setFormData] = useState({
        ...initialFormData,
        metodoEnvio: metodosEnvio[0].id
    });
    const [errores, setErrores] = useState(initialErrores);

    // Auto-rellenar datos del usuario logueado
    useEffect(() => {
        if (user) {
            // Separar nombre completo en nombre y apellido
            const nombreCompleto = user.nombre || '';
            const partesNombre = nombreCompleto.split(' ');
            const nombre = partesNombre[0] || '';
            const apellido = partesNombre.slice(1).join(' ') || '';

            setFormData(prevData => ({
                ...prevData,
                nombre: nombre,
                apellido: apellido,
                email: user.email || ''
            }));
        }
    }, [user]);

    // C├ílculos
    const total = obtenerTotal();
    const metodoSeleccionado = metodosEnvio.find(m => m.id === formData.metodoEnvio);
    const costoEnvio = metodoSeleccionado?.precio || metodosEnvio[0].precio;
    const totalFinal = total + costoEnvio;

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        
        // Formateo espec├¡fico por campo
        switch (name) {
            case 'numeroTarjeta':
                formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                if (formattedValue.length > 19) return; // 16 d├¡gitos + 3 espacios
                break;
            case 'telefono':
                formattedValue = value.replace(/\D/g, '');
                if (formattedValue.length > 9) return;
                break;
            case 'cvv':
                formattedValue = value.replace(/\D/g, '');
                if (formattedValue.length > 4) return;
                break;
        }
        
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        
        // Limpiar error cuando el usuario escribe
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = { ...initialErrores };
        const camposRequeridos = [
            'nombre', 'apellido', 'email', 'telefono', 
            'direccion', 'ciudad', 'region', 'codigoPostal',
            'numeroTarjeta', 'nombreTarjeta', 'mesVencimiento', 'anioVencimiento', 'cvv'
        ];
        
        // Validar campos requeridos
        camposRequeridos.forEach(campo => {
            if (!formData[campo]?.toString().trim()) {
                nuevosErrores[campo] = `${campo.charAt(0).toUpperCase() + campo.slice(1)} es requerido`;
            }
        });
        
        // Validaciones espec├¡ficas
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nuevosErrores.email = 'Email inv├ílido';
        }
        
        if (formData.telefono && formData.telefono.length !== 9) {
            nuevosErrores.telefono = 'El tel├®fono debe tener 9 d├¡gitos';
        }
        
        const numeroLimpio = formData.numeroTarjeta.replace(/\s/g, '');
        if (formData.numeroTarjeta && numeroLimpio.length !== 16) {
            nuevosErrores.numeroTarjeta = 'El n├║mero de tarjeta debe tener 16 d├¡gitos';
        }
        
        if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
            nuevosErrores.cvv = 'El CVV debe tener 3 o 4 d├¡gitos';
        }
        
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some(error => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Solo validar datos personales y direcci├│n, no tarjeta (Mercado Pago la manejar├í)
        const nuevosErrores = { ...initialErrores };
        const camposRequeridos = [
            'nombre', 'apellido', 'email', 'telefono', 
            'direccion', 'ciudad', 'region', 'codigoPostal'
        ];
        
        camposRequeridos.forEach(campo => {
            if (!formData[campo]?.toString().trim()) {
                nuevosErrores[campo] = `${campo.charAt(0).toUpperCase() + campo.slice(1)} es requerido`;
            }
        });
        
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nuevosErrores.email = 'Email inv├ílido';
        }
        
        if (formData.telefono && formData.telefono.length !== 9) {
            nuevosErrores.telefono = 'El tel├®fono debe tener 9 d├¡gitos';
        }
        
        setErrores(nuevosErrores);
        if (Object.values(nuevosErrores).some(error => error !== '')) {
            showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        if (cart.length === 0) {
            showToast('Tu carrito est├í vac├¡o', 'warning');
            router.push('/productos');
            return;
        }

        // Verificar si el usuario est├í logueado
        if (!user) {
            showToast('Necesitas iniciar sesi├│n para completar tu compra', 'info');
            setTimeout(() => router.push('/login'), 2000);
            return;
        }
        
        setLoading(true);
        setProcesando(true);
        
        try {
            // Verificar que el usuario est├® autenticado
            if (!user || !token) {
                showToast('Debes iniciar sesi├│n para realizar el pedido', 'error');
                router.push('/login');
                return;
            }
            
            console.log('=== CREANDO PREFERENCIA MERCADO PAGO ===');
            
            // Preparar datos para Mercado Pago
            const pagoData = {
                pedidoId: `ORDEN-${user.id}-${Date.now()}`,
                productos: cart.map(item => ({
                    productoId: item.id,
                    nombre: item.nombre,
                    descripcion: item.descripcion || item.nombre,
                    imagenUrl: item.imagen || 'https://via.placeholder.com/150',
                    cantidad: item.quantity || 1,
                    precio: item.descuento 
                        ? Math.round(item.precio * (1 - item.descuento / 100))
                        : item.precio
                })),
                comprador: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    telefono: formData.telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    codigoPostal: formData.codigoPostal
                }
            };
            
            console.log('Data para MP:', JSON.stringify(pagoData, null, 2));
            
            // Crear preferencia en Mercado Pago
            const preferencia = await crearPreferenciaMercadoPago(pagoData, token);
            
            console.log('Preferencia creada:', preferencia);
            
            // Guardar datos en localStorage para recuperar despu├®s del pago
            localStorage.setItem('pedidoPendiente', JSON.stringify({
                pedidoId: pagoData.pedidoId,
                items: cart.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity || 1,
                    precioUnitario: item.descuento 
                        ? Math.round(item.precio * (1 - item.descuento / 100))
                        : item.precio
                })),
                total: totalFinal,
                direccionEnvio: `${formData.direccion}, ${formData.ciudad}, ${formData.region}, ${formData.codigoPostal}`,
                metodoPago: 'Mercado Pago'
            }));
            
            // Redirigir a Mercado Pago
            showToast('Redirigiendo a Mercado Pago...', 'info');
            setTimeout(() => {
                window.location.href = preferencia.initPoint;
            }, 1000);
            
        } catch (error) {
            console.error('Error procesando pago:', error);
            showToast('Hubo un error procesando tu pedido. Intenta nuevamente.', 'error');
            setProcesando(false);
            setLoading(false);
        }
    };

    // Renderizado condicional
    if (cart.length === 0 && !pagoCompletado) return <CarritoVacio />;
    if (pagoCompletado) return <PagoExitoso />;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <ToastContainer />
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <Link 
                        href="/carrito"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al carrito
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <InformacionPersonal 
                            formData={formData}
                            errores={errores}
                            handleInputChange={handleInputChange}
                            user={user}
                        />

                        <DireccionEnvio 
                            formData={formData}
                            errores={errores}
                            handleInputChange={handleInputChange}
                        />

                        <MetodoEnvio 
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        {/* Informaci├│n de Mercado Pago */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                M├®todo de Pago
                            </h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-1">Pago seguro con Mercado Pago</h3>
                                        <p className="text-sm text-blue-800">
                                            Ser├ís redirigido a Mercado Pago para completar tu pago de forma segura. 
                                            Puedes pagar con tarjeta de cr├®dito, d├®bito o efectivo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <img 
                                    src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-xl@2x.png" 
                                    alt="Mercado Pago" 
                                    className="h-8 object-contain"
                                />
                                <div className="flex gap-2">
                                    <svg className="w-10 h-6" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#1434CB"/>
                                        <path d="M15.3 20.5h-3.6l2.2-13.6h3.6l-2.2 13.6zm15.8-13.3c-.7-.3-1.8-.6-3.2-.6-3.5 0-6 1.9-6 4.5 0 2 1.8 3 3.1 3.7 1.4.7 1.8 1.1 1.8 1.7 0 .9-1.1 1.3-2.1 1.3-1.4 0-2.1-.2-3.2-.7l-.4-.2-.5 2.9c.8.4 2.4.7 4 .7 3.7 0 6.1-1.8 6.1-4.7 0-1.5-.9-2.7-2.9-3.6-1.2-.6-1.9-1-1.9-1.6 0-.5.6-1.1 1.9-1.1 1.1 0 1.9.2 2.5.5l.3.1.5-2.9zm8.9-.3h-2.8c-.9 0-1.5.2-1.9 1.1l-5.4 12.5h3.7s.6-1.6.7-2h4.5c.1.5.4 2 .4 2h3.3l-2.5-13.6zm-4.4 8.8c.3-.8 1.4-3.7 1.4-3.7s.3-.8.5-1.3l.2 1.2s.7 3.3.9 4h-3zm-16.8-8.8l-3.5 9.3-.4-1.9c-.7-2.3-2.8-4.8-5.2-6l3.2 12.1h3.7l5.5-13.5h-3.3z" fill="white"/>
                                    </svg>
                                    <svg className="w-10 h-6" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#EB001B"/>
                                        <circle cx="19" cy="16" r="10" fill="#EB001B"/>
                                        <circle cx="29" cy="16" r="10" fill="#F79E1B"/>
                                        <path d="M24 8.5c1.9 1.5 3 3.8 3 6.5s-1.1 5-3 6.5c-1.9-1.5-3-3.8-3-6.5s1.1-5 3-6.5z" fill="#FF5F00"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <ResumenPedido 
                            cart={cart}
                            total={total}
                            costoEnvio={costoEnvio}
                            totalFinal={totalFinal}
                            loading={loading}
                            procesando={procesando}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
