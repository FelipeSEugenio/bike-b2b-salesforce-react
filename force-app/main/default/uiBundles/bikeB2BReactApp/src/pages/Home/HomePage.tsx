import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to the Bike B2B Portal</h1>
        <p className="mt-2 text-gray-600">Manage your bike fleet and orders with ease.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Total Bikes</h2>
          <p className="text-gray-400">--</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
          <p className="text-gray-400">--</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
