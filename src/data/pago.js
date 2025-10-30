export const regiones = [
    { value: "RM", label: "Región Metropolitana" },
    { value: "XV", label: "Arica y Parinacota" },
    { value: "I", label: "Tarapacá" },
    { value: "II", label: "Antofagasta" },
    { value: "III", label: "Atacama" },
    { value: "IV", label: "Coquimbo" },
    { value: "V", label: "Valparaíso" },
    { value: "VI", label: "O'Higgins" },
    { value: "VII", label: "Maule" },
    { value: "XVI", label: "Ñuble" },
    { value: "VIII", label: "Biobío" },
    { value: "IX", label: "La Araucanía" },
    { value: "XIV", label: "Los Ríos" },
    { value: "X", label: "Los Lagos" },
    { value: "XI", label: "Aysén" },
    { value: "XII", label: "Magallanes" }
];

export const metodosEnvio = [
    {
        id: "standard",
        nombre: "Envío Standard",
        descripcion: "3-5 días hábiles",
        precio: 2000
    },
    {
        id: "express",
        nombre: "Envío Express", 
        descripcion: "1-2 días hábiles",
        precio: 5000
    }
];

export const meses = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
}));

export const anios = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return {
        value: year.toString(),
        label: year.toString()
    };
});

export const camposFormulario = {
    personal: [
        { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Tu nombre', required: true },
        { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Tu apellido', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com', required: true },
        { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '912345678', required: true }
    ],
    direccion: [
        { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Calle 123, Comuna', required: true },
        { name: 'ciudad', label: 'Ciudad', type: 'text', placeholder: 'Santiago', required: true },
        { name: 'codigoPostal', label: 'Código Postal', type: 'text', placeholder: '7500000', required: true }
    ],
    pago: [
        { name: 'numeroTarjeta', label: 'Número de Tarjeta', type: 'text', placeholder: '1234 5678 9012 3456', required: true },
        { name: 'nombreTarjeta', label: 'Nombre en la Tarjeta', type: 'text', placeholder: 'JUAN PEREZ', required: true },
        { name: 'cvv', label: 'CVV', type: 'text', placeholder: '123', required: true }
    ]
};

// Estructura inicial del formulario
export const initialFormData = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    numeroTarjeta: '',
    nombreTarjeta: '',
    mesVencimiento: '',
    anioVencimiento: '',
    cvv: '',
    metodoEnvio: 'standard'
};

// Estructura inicial de errores
export const initialErrores = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    numeroTarjeta: '',
    nombreTarjeta: '',
    mesVencimiento: '',
    anioVencimiento: '',
    cvv: ''
};