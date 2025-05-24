import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, BookCopy, LogIn, UserPlus, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeClassName = "bg-indigo-700 text-white";
  const inactiveClassName = "text-indigo-100 hover:bg-indigo-500 hover:text-white";
  const linkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center";

  const navLinks = [
    { to: "/", text: "Home", icon: <Home size={18} className="mr-2" /> },
    { to: "/books", text: "Books", icon: <BookCopy size={18} className="mr-2" /> },
  ];

  const authLinks = isAuthenticated ? [
    { to: `/profile/${currentUser?.id || 'me'}`, text: "Profile", icon: <UserCircle size={18} className="mr-2" /> },
    { onClick: logout, text: "Logout", icon: <LogOut size={18} className="mr-2" />, isButton: true },
  ] : [
    { to: "/login", text: "Login", icon: <LogIn size={18} className="mr-2" /> },
    { to: "/signup", text: "Sign Up", icon: <UserPlus size={18} className="mr-2" /> },
  ];

  const renderNavLink = (link, isMobile = false) => {
    const classNames = `${linkBaseClasses} ${isMobile ? 'block w-full text-left' : ''}`;
    if (link.isButton) {
      return (
        <button key={link.text} onClick={link.onClick} className={`${classNames} ${inactiveClassName}`}>
          {link.icon}{link.text}
        </button>
      );
    }
    return (
      <NavLink
        key={link.text}
        to={link.to}
        className={({ isActive }) => `${classNames} ${isActive ? activeClassName : inactiveClassName}`}
        onClick={() => isMobile && setMobileMenuOpen(false)} 
      >
        {link.icon}{link.text}
      </NavLink>
    );
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-200 transition-colors">
              BookReview
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map(link => renderNavLink(link))}
            <div className="w-px h-6 bg-indigo-400 mx-2"></div> 
            {authLinks.map(link => renderNavLink(link))}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-indigo-600 p-2 space-y-1 sm:px-3 z-40 shadow-lg">
          {navLinks.map(link => renderNavLink(link, true))}
          <hr className="border-indigo-400 my-1"/>
          {authLinks.map(link => renderNavLink(link, true))}
        </div>
      )}
    </nav>
  );
};
export default Navbar;