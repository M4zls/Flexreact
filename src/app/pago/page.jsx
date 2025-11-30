'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../Components/Toast';
import { crearPedido } from '../../services/api';
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

    // Cálculos
    const total = obtenerTotal();
    const metodoSeleccionado = metodosEnvio.find(m => m.id === formData.metodoEnvio);
    const costoEnvio = metodoSeleccionado?.precio || metodosEnvio[0].precio;
    const totalFinal = total + costoEnvio;

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        
        // Formateo específico por campo
        switch (name) {
            case 'numeroTarjeta':
                formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                if (formattedValue.length > 19) return; // 16 dígitos + 3 espacios
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
        
        // Validaciones específicas
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nuevosErrores.email = 'Email inválido';
        }
        
        if (formData.telefono && formData.telefono.length !== 9) {
            nuevosErrores.telefono = 'El teléfono debe tener 9 dígitos';
        }
        
        const numeroLimpio = formData.numeroTarjeta.replace(/\s/g, '');
        if (formData.numeroTarjeta && numeroLimpio.length !== 16) {
            nuevosErrores.numeroTarjeta = 'El número de tarjeta debe tener 16 dígitos';
        }
        
        if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
            nuevosErrores.cvv = 'El CVV debe tener 3 o 4 dígitos';
        }
        
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some(error => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) return;
        
        if (cart.length === 0) {
            showToast('Tu carrito está vacío', 'warning');
            router.push('/productos');
            return;
        }

        // Verificar si el usuario está logueado
        if (!user) {
            showToast('Necesitas iniciar sesión para completar tu compra', 'info');
            setTimeout(() => router.push('/login'), 2000);
            return;
        }
        
        setLoading(true);
        setProcesando(true);
        
        try {
            // Verificar que el usuario esté autenticado
            if (!user || !token) {
                showToast('Debes iniciar sesión para realizar el pedido', 'error');
                router.push('/login');
                return;
            }
            
            console.log('=== DEBUG CREAR PEDIDO ===');
            console.log('User:', user);
            console.log('Token presente:', !!token);
            console.log('Token length:', token?.length);
            console.log('=========================');
            
            // Crear el pedido con la estructura correcta para el backend
            const pedidoData = {
                email: user.email,
                nombre: user.nombre,
                items: cart.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity || 1, 
                    precioUnitario: item.descuento 
                        ? Math.round(item.precio * (1 - item.descuento / 100))
                        : item.precio
                })),
                total: totalFinal,
                direccionEnvio: `${formData.direccion}, ${formData.ciudad}, ${formData.region}, ${formData.codigoPostal}`,
                metodoPago: 'Tarjeta de Crédito'
            };
            
            console.log('Pedido data:', JSON.stringify(pedidoData, null, 2));
            
            // Llamar al backend para crear el pedido
            const response = await crearPedido(pedidoData, token);
            
            console.log('Pedido creado:', response);
            
            // Limpiar carrito
            limpiarCarrito();
            setPagoCompletado(true);
            setProcesando(false);
            
            showToast('¡Pedido realizado exitosamente!', 'success');
            
            // Auto-redirect después de 3 segundos
            setTimeout(() => router.push('/cuenta?tab=pedidos'), 3000);
            
        } catch (error) {
            console.error('Error procesando pago:', error);
            showToast('Hubo un error procesando tu pedido. Intenta nuevamente.', 'error');
            setProcesando(false);
        } finally {
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

                        <InformacionPago 
                            formData={formData}
                            errores={errores}
                            handleInputChange={handleInputChange}
                        />
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
