'use client';

import { CartProvider } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-black">
      <body className="bg-black">
        <CartProvider>
          <Navbar />
          <main className="content-container bg-black">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
