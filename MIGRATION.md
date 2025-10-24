# Guía de Migración a Next.js - MokkiCoffee

## ✅ Archivos Creados

He creado la estructura básica de Next.js usando el directorio `src`:

```
Flex/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Layout principal con Navbar y Footer
│   │   ├── page.jsx             # Página de inicio
│   │   ├── productos/
│   │   │   └── page.jsx         # Página de productos
│   │   ├── nosotros/
│   │   │   └── page.jsx         # Página nosotros
│   │   ├── blog/
│   │   │   └── page.jsx         # Página blog
│   │   ├── contacto/
│   │   │   └── page.jsx         # Página contacto
│   │   └── carrito/
│   │       └── page.jsx         # Página carrito
│   ├── components/
│   │   ├── Navbar.jsx           # Navbar adaptado para Next.js
│   │   └── Footer.jsx           # Footer
│   ├── context/
│   │   └── CartContext.jsx      # Context API con 'use client'
│   └── styles/
│       └── globals.css          # Estilos globales con Tailwind
├── next.config.mjs              # Configuración de Next.js
├── tailwind.config.js           # Actualizado para Next.js
├── postcss.config.js            # Ya configurado
└── package.json                 # Actualizado con dependencias Next.js
```

## 📦 Pasos para Completar la Migración

### 1. Eliminar archivos de Vite (opcional, pero recomendado)
```powershell
Remove-Item -Path ".\src" -Recurse -Force
Remove-Item -Path ".\index.html" -Force
Remove-Item -Path ".\vite.config.js" -Force
```

### 2. Reinstalar dependencias
```powershell
# Eliminar node_modules y package-lock
Remove-Item -Path ".\node_modules" -Recurse -Force
Remove-Item -Path ".\package-lock.json" -Force

# Instalar dependencias de Next.js
npm install
```

### 3. Iniciar el servidor de desarrollo
```powershell
npm run dev
```

El servidor estará disponible en: http://localhost:3000

## 🔄 Cambios Principales

### De React Router a Next.js Router
- ❌ `<Link to="/">` → ✅ `<Link href="/">`
- ❌ `react-router-dom` → ✅ `next/link`
- ❌ `<Routes>` y `<Route>` → ✅ Sistema de archivos en `/app`

### Componentes con Estado
- Todos los componentes que usan hooks (`useState`, `useContext`, etc.) necesitan `'use client'` al inicio
- El `layout.jsx` puede ser Server Component
- Los `page.jsx` son Client Components si usan interactividad

### Sistema de Rutas
En Next.js, las rutas se crean con carpetas:
- `/` → `app/page.jsx`
- `/productos` → `app/productos/page.jsx`
- `/nosotros` → `app/nosotros/page.jsx`
- `/blog` → `app/blog/page.jsx`
- `/contacto` → `app/contacto/page.jsx`
- `/carrito` → `app/carrito/page.jsx`

## 📝 Próximos Pasos

1. **Copiar contenido de tus páginas actuales:**
   - Copia el contenido de `src/Routes/Home.jsx` a `app/home/page.jsx`
   - Crea las demás páginas en `app/` según las necesites

2. **Crear las rutas faltantes:**
   ```powershell
   # Crear páginas
   New-Item -ItemType Directory -Path ".\app\productos"
   New-Item -ItemType File -Path ".\app\productos\page.jsx"
   
   New-Item -ItemType Directory -Path ".\app\nosotros"
   New-Item -ItemType File -Path ".\app\nosotros\page.jsx"
   
   New-Item -ItemType Directory -Path ".\app\blog"
   New-Item -ItemType File -Path ".\app\blog\page.jsx"
   
   New-Item -ItemType Directory -Path ".\app\contacto"
   New-Item -ItemType File -Path ".\app\contacto\page.jsx"
   
   New-Item -ItemType Directory -Path ".\app\carrito"
   New-Item -ItemType File -Path ".\app\carrito\page.jsx"
   ```

3. **Migrar componentes:**
   - Copia otros componentes de `src/Components/` a `components/`
   - Agrega `'use client'` si usan hooks o interactividad

4. **Migrar datos:**
   - Copia el contenido de `src/data/` a `data/`

## 🎨 Beneficios de Next.js

✅ **Mejor SEO** - Server-side rendering
✅ **Mejor rendimiento** - Optimización automática
✅ **Sistema de rutas más simple** - Basado en archivos
✅ **Optimización de imágenes** - Componente `<Image />`
✅ **API Routes** - Backend integrado
✅ **Deploy fácil** - Optimizado para Vercel

## 🚀 ¿Listo?

Ejecuta estos comandos para empezar:

```powershell
# Limpiar e instalar
Remove-Item -Path ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\package-lock.json" -Force -ErrorAction SilentlyContinue
npm install

# Iniciar Next.js
npm run dev
```

¡Tu aplicación estará corriendo en http://localhost:3000! 🎉
