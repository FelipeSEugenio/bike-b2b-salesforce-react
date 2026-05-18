import React from 'react';
import { Link, useLocation } from 'react-router';

const Header: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Orders', path: '/orders' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Bike B2B Portal
            </Link>
          </div>
          <nav className="hidden sm:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-5 -mb-5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {/* Mobile menu button could go here if needed, keeping it simple for now as requested */}
        </div>
      </div>
    </header>
  );
};

export default Header;
