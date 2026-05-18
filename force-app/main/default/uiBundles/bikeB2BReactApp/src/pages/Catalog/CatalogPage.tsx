import React from 'react';

const CatalogPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bike Catalog</h1>
          <p className="mt-2 text-gray-600">Browse our available bike models.</p>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p>No bikes available in the catalog yet.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Placeholders for cards */}
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="h-48 bg-gray-50 rounded-md border border-dashed border-gray-300"></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
