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
    <div className="bg-card p-5 rounded-lg shadow-sm border border-border flex flex-col md:flex-row gap-4 items-end md:items-center transition-all duration-200">
      <div className="flex-grow w-full">
        <label htmlFor="search" className="block text-sm font-semibold text-foreground mb-1.5">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            className="block w-full rounded-md border border-border bg-background text-foreground pr-10 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm py-2 px-3 transition-all placeholder:text-muted-foreground outline-none"
            placeholder="Search by name or model"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full md:w-64">
        <label htmlFor="brand" className="block text-sm font-semibold text-foreground mb-1.5">
          Brand
        </label>
        <select
          id="brand"
          className="block w-full rounded-md border border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm py-2 px-3 transition-all outline-none"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
        >
          <option value="all" className="bg-card text-foreground">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand} className="bg-card text-foreground">
              {brand}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CatalogFilters;
