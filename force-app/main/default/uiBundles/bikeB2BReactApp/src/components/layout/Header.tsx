import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Orders', path: '/orders' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-lg sm:text-xl font-black text-primary tracking-tight transition-transform hover:scale-[1.02]">
              Bike B2B Portal
            </Link>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex space-x-3 sm:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs sm:text-sm font-semibold transition-all relative pb-5 -mb-5 ${
                    location.pathname === link.path
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-yellow-500 fill-yellow-500/20" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
