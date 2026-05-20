import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-card border-t border-border py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bike B2B Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
