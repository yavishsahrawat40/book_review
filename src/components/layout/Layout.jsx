// frontend/src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar'; // Assuming Navbar.jsx is in the same directory
import Footer from './Footer'; // Assuming Footer.jsx is in the same directory

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100"> {/* Changed bg-gray-100 to bg-slate-100 for a slightly cooler tone */}
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8"> {/* Added container and padding to main content area */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;