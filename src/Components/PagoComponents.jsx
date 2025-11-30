import { ArrowLeft, CheckCircle2, User, MapPin, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { regiones, metodosEnvio, meses, anios } from '../data/pago';

// Componente para campos de input
export const InputField = ({ label, name, type = "text", placeholder, required = true, formData, errores, handleInputChange, isAutoFilled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'} {isAutoFilled && <span className="text-green-600 text-xs">(Auto-completado)</span>}
        </label>
        <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                errores[name] ? 'border-red-500' : isAutoFilled ? 'border-green-300 bg-green-50' : 'border-gray-300'
            }`}
            placeholder={placeholder}
        />
        {errores[name] && (
            <p className="text-red-500 text-sm mt-1">{errores[name]}</p>
        )}
        {isAutoFilled && !errores[name] && (
            <p className="text-green-600 text-xs mt-1">✓ Completado desde tu perfil</p>
        )}
    </div>
);

// Componente para campos de select
export const SelectField = ({ label, name, options, placeholder, required = true, formData, errores, handleInputChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                errores[name] ? 'border-red-500' : 'border-gray-300'
            }`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {errores[name] && (
            <p className="text-red-500 text-sm mt-1">{errores[name]}</p>
        )}
    </div>
);

// Componente para carrito vacío
export const CarritoVacio = () => (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-md mx-auto text-center p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito Vacío</h1>
            <p className="text-gray-600 mb-6">
                No tienes productos en tu carrito para proceder al pago.
            </p>
            <Link 
                href="/productos"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Ver Productos
            </Link>
        </div>
    </div>
);

// Componente para pago exitoso
export const PagoExitoso = () => (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-md mx-auto text-center p-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-6">
                    Tu pedido ha sido procesado correctamente. 
                    Recibirás un email de confirmación en breve.
                </p>
                <div className="text-sm text-gray-500">
                    Serás redirigido automáticamente...
                </div>
            </div>
        </div>
    </div>
);

// Componente de información personal
export const InformacionPersonal = ({ formData, errores, handleInputChange, user }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
            {user && (
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full ml-auto">
                    ✓ Datos de tu cuenta
                </span>
            )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
                label="Nombre"
                name="nombre"
                placeholder="Tu nombre"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
                isAutoFilled={user && formData.nombre}
            />
            <InputField 
                label="Apellido"
                name="apellido"
                placeholder="Tu apellido"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
                isAutoFilled={user && formData.apellido}
            />
            <InputField 
                label="Email"
                name="email"
                type="email"
                placeholder="tu@gmail.com"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
                isAutoFilled={user && formData.email}
            />
            <InputField 
                label="Teléfono"
                name="telefono"
                type="tel"
                placeholder="912345678"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
            />
        </div>
    </div>
);

// Componente de dirección de envío
export const DireccionEnvio = ({ formData, errores, handleInputChange }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Dirección de Envío
        </h2>
        <div className="space-y-4">
            <InputField 
                label="Dirección"
                name="direccion"
                placeholder="Calle 123, Comuna"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField 
                    label="Ciudad"
                    name="ciudad"
                    placeholder="Santiago"
                    formData={formData}
                    errores={errores}
                    handleInputChange={handleInputChange}
                />
                <SelectField 
                    label="Región"
                    name="region"
                    options={regiones}
                    placeholder="Selecciona región"
                    formData={formData}
                    errores={errores}
                    handleInputChange={handleInputChange}
                />
                <InputField 
                    label="Código Postal"
                    name="codigoPostal"
                    placeholder="7500000"
                    formData={formData}
                    errores={errores}
                    handleInputChange={handleInputChange}
                />
            </div>
        </div>
    </div>
);

// Componente de método de envío
export const MetodoEnvio = ({ formData, handleInputChange }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Método de Envío</h2>
        <div className="space-y-3">
            {metodosEnvio.map((metodo) => (
                <label key={metodo.id} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="metodoEnvio"
                        value={metodo.id}
                        checked={formData.metodoEnvio === metodo.id}
                        onChange={handleInputChange}
                        className="text-red-600 focus:ring-red-500"
                    />
                    <div className="flex-1">
                        <div className="font-medium text-gray-900">{metodo.nombre}</div>
                        <div className="text-sm text-gray-600">{metodo.descripcion}</div>
                    </div>
                    <div className="font-semibold text-gray-900">
                        ${metodo.precio.toLocaleString('es-CL')}
                    </div>
                </label>
            ))}
        </div>
    </div>
);

// Componente de información de pago
export const InformacionPago = ({ formData, errores, handleInputChange }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Información de Pago
        </h2>
        <div className="space-y-4">
            <InputField 
                label="Número de Tarjeta"
                name="numeroTarjeta"
                placeholder="1234 5678 9012 3456"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
            />
            <InputField 
                label="Nombre en la Tarjeta"
                name="nombreTarjeta"
                placeholder="JUAN PEREZ"
                formData={formData}
                errores={errores}
                handleInputChange={handleInputChange}
            />
            <div className="grid grid-cols-3 gap-4">
                <SelectField 
                    label="Mes"
                    name="mesVencimiento"
                    options={meses}
                    placeholder="Mes"
                    formData={formData}
                    errores={errores}
                    handleInputChange={handleInputChange}
                />
                <SelectField 
                    label="Año"
                    name="anioVencimiento"
                    options={anios}
                    placeholder="Año"
                    formData={formData}
                    errores={errores}
                    handleInputChange={handleInputChange}
                />
                <InputField 
                    label="CVV"
                    name="cvv"
                    placeholder="123"
                    formData={formData}
                    errores={errores}
                    handleInputChange={handleInputChange}
                />
            </div>
        </div>
    </div>
);

// Componente de resumen del pedido
export const ResumenPedido = ({ cart, total, costoEnvio, totalFinal, loading, procesando }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>
        <div className="space-y-4 mb-6">
            {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                            {item.nombre}
                        </h4>
                        <p className="text-xs text-gray-600">Talla: {item.size}</p>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-600">
                                Cantidad: {item.quantity}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                ${(item.precio * item.quantity).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${total.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-gray-900">${costoEnvio.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${totalFinal.toLocaleString('es-CL')}</span>
            </div>
        </div>

        <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
            {procesando ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                </>
            ) : (
                <>
                    <Lock className="w-4 h-4" />
                    Pagar ${totalFinal.toLocaleString('es-CL')}
                </>
            )}
        </button>

        <div className="text-xs text-gray-500 text-center mt-3">
            Transacción segura y encriptada
        </div>
    </div>
);