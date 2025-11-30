# Flexreact - E-commerce de Zapatillas

Una página dedicada a la venta de zapatillas hecha con React + Next.js

## 🚀 Tecnologías

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Spring Boot 3.2, PostgreSQL (Supabase)
- **Autenticación**: JWT

## 📦 Instalación Local

### Frontend

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Editar .env.local y configurar NEXT_PUBLIC_API_URL

# Ejecutar en desarrollo
npm run dev
```

### Backend

Ver README del backend en `Flexreact-Backend/`

## 🌐 Despliegue en Producción

### Frontend (Vercel)

1. Push tu código a GitHub
2. Ve a https://vercel.com e importa tu repositorio
3. Configura la variable de entorno en Vercel:
   - `NEXT_PUBLIC_API_URL` = URL de tu backend de Railway

### Backend (Railway)

1. Ve a https://railway.app
2. Crea un nuevo proyecto desde GitHub
3. Configura las variables de entorno necesarias (ver Backend README)

## 📝 Variables de Entorno

Ver `.env.example` para las variables requeridas.

## 🔑 Características

- ✅ Catálogo de productos con filtros
- ✅ Sistema de carrito de compras
- ✅ Autenticación de usuarios (JWT)
- ✅ Gestión de pedidos
- ✅ Sistema de stock por tallas
- ✅ Panel de cuenta de usuario



