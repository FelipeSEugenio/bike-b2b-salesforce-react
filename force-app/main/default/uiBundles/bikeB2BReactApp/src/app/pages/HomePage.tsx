import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome to the Bike B2B Portal</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">Manage your bike fleet, search catalogs, and track purchase orders with ease.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg shadow-sm border border-border transition-all duration-200 hover:shadow-md">
          <h2 className="text-lg font-bold text-foreground mb-2">Total Bikes</h2>
          <p className="text-3xl font-black text-primary">--</p>
          <p className="text-xs text-muted-foreground mt-2">Available models in catalog</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm border border-border transition-all duration-200 hover:shadow-md">
          <h2 className="text-lg font-bold text-foreground mb-2">Pending Orders</h2>
          <p className="text-3xl font-black text-primary">--</p>
          <p className="text-xs text-muted-foreground mt-2">Awaiting validation or approval</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm border border-border transition-all duration-200 hover:shadow-md">
          <h2 className="text-lg font-bold text-foreground mb-2">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
