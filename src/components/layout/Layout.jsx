import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100"> 
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8"> 
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;