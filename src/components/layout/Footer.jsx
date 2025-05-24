import React from 'react';

const Footer = () => (
  <footer className="bg-slate-800 text-slate-300 p-8 text-center text-sm">
    <div className="container mx-auto">
      <p>&copy; {new Date().getFullYear()} BookReview Platform. All rights reserved.</p>
      <p className="mt-1">Crafted with <span role="img" aria-label="heart">❤️</span> using React & Tailwind CSS.</p>
    </div>
  </footer>
);

export default Footer;
