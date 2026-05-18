import React from 'react';

interface CatalogFiltersProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  selectedBrand: string;
  onBrandChange: (value: string) => void;
  brands: string[];
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  searchText,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  brands,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-end sm:items-center">
      <div className="flex-grow w-full">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
            placeholder="Search by name or code"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-64">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <select
          id="brand"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
        >
          <option value="all">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CatalogFilters;
