'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../Components/Toast';
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
    const { user, agregarPedido } = useAuth();
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
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Crear el pedido
            const pedidoData = {
                productos: cart,
                total: totalFinal,
                direccion: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    telefono: formData.telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    region: formData.region,
                    codigoPostal: formData.codigoPostal
                },
                metodoEnvio: {
                    id: formData.metodoEnvio,
                    nombre: metodoSeleccionado?.nombre,
                    precio: costoEnvio
                },
                metodoPago: {
                    numeroTarjeta: formData.numeroTarjeta.replace(/\s/g, ''),
                    nombreTarjeta: formData.nombreTarjeta
                }
            };
            
            // Agregar pedido al usuario
            agregarPedido(pedidoData);
            
            // Limpiar carrito
            limpiarCarrito();
            setPagoCompletado(true);
            setProcesando(false);
            
            // Auto-redirect después de 3 segundos
            setTimeout(() => router.push('/cuenta?tab=pedidos'), 3000);
            
        } catch (error) {
            console.error('Error procesando pago:', error);
            showToast('Hubo un error procesando tu pago. Intenta nuevamente.', 'error');
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
