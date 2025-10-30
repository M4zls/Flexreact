'use client';

import { CartProvider } from '../context/CartContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-black z-10">
      <body className="bg-black">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="content-container bg-black">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
