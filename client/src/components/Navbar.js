import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // Mock authentication state - will be replaced with actual auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : 'nav-link';
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <i className="fas fa-dice text-indigo-500 text-2xl mr-2"></i>
              <span className="text-white text-xl font-bold">Bets Wizz</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/sports" className={isActive('/sports')}>Sports</Link>
              <Link to="/casino" className={isActive('/casino')}>Casino</Link>
              <Link to="/mini-games" className={isActive('/mini-games')}>Mini Games</Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/wallet" className="btn-secondary">
                    <i className="fas fa-wallet mr-2"></i>Wallet
                  </Link>
                  <Link to="/profile" className="btn-secondary">
                    <i className="fas fa-user mr-2"></i>Profile
                  </Link>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="btn-primary"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="btn-secondary">Login</Link>
                  <Link to="/register" className="btn-primary">Register</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/sports" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Sports
            </Link>
            <Link 
              to="/casino" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Casino
            </Link>
            <Link 
              to="/mini-games" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Mini Games
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <Link
                  to="/wallet"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Wallet
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;