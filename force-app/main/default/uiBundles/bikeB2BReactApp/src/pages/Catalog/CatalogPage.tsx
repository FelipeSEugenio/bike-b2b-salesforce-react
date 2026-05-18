import React, { useState, useMemo } from 'react';
import { useBikeCatalog } from '@/services/bikeService';
import { createOrderWithItems } from '@/services/orderMutationService';
import CatalogFilters from './CatalogFilters';
import DraftOrderSidebar, { DraftOrderItem } from './DraftOrderSidebar';
import { Link } from 'react-router';

const CatalogPage: React.FC = () => {
  const { bikes, loading, error } = useBikeCatalog();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [draftItems, setDraftItems] = useState<DraftOrderItem[]>([]);
  
  // Mutation states
  const [accountId, setAccountId] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(bikes.map((b) => b.brand).filter(Boolean))).sort();
  }, [bikes]);

  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      const matchesSearch =
        !searchText ||
        bike.name.toLowerCase().includes(searchText.toLowerCase()) ||
        bike.code.toLowerCase().includes(searchText.toLowerCase());

      const matchesBrand = selectedBrand === 'all' || bike.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [bikes, searchText, selectedBrand]);

  const totalQuantity = useMemo(() => {
    return draftItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [draftItems]);

  const totalAmount = useMemo(() => {
    return draftItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [draftItems]);

  const handleAddToOrder = (bikeId: string) => {
    const bike = bikes.find(b => b.id === bikeId);
    if (!bike) return;

    setDraftItems(prev => {
      const existing = prev.find(item => item.bikeId === bikeId);
      if (existing) {
        return prev.map(item => 
          item.bikeId === bikeId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        bikeId: bike.id,
        name: bike.name,
        code: bike.code,
        brand: bike.brand,
        unitPrice: bike.price,
        quantity: 1
      }];
    });
  };

  const handleUpdateQuantity = (bikeId: string, delta: number) => {
    setDraftItems(prev => prev.map(item => 
      item.bikeId === bikeId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleRemoveItem = (bikeId: string) => {
    setDraftItems(prev => prev.filter(item => item.bikeId !== bikeId));
  };

  const handleConfirmOrder = async () => {
    if (draftItems.length === 0 || !accountId) return;

    try {
      setIsCreating(true);
      setCreateError(null);
      setCreateSuccess(null);

      const result = await createOrderWithItems({
        accountId,
        status: 'Draft',
        items: draftItems,
        totalAmount
      });

      setCreateSuccess(`Order ${result.orderId} created successfully!`);
      setDraftItems([]);
      setAccountId('');
    } catch (err) {
      console.error('Failed to create order:', err);
      setCreateError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Bike Catalog</h1>
        <p className="mt-2 text-gray-600">Browse our available bike models and create an order draft.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-6">
          {!loading && !error && bikes.length > 0 && (
            <CatalogFilters
              searchText={searchText}
              onSearchChange={setSearchText}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              brands={uniqueBrands}
            />
          )}

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 font-medium">Loading bikes...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Something went wrong while loading the bike catalog: <span className="font-semibold">{error}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && bikes.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No bikes found in the catalog.</p>
            </div>
          )}

          {!loading && !error && bikes.length > 0 && filteredBikes.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No bikes match your filters.</p>
              <button
                onClick={() => {
                  setSearchText('');
                  setSelectedBrand('all');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && filteredBikes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBikes.map((bike) => (
                      <tr key={bike.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bike.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{bike.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{bike.brand}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {bike.displayPrice || `$${bike.price.toFixed(2)}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            disabled={isCreating}
                            onClick={() => handleAddToOrder(bike.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                          >
                            Add to order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="w-full space-y-4">
          <DraftOrderSidebar
            items={draftItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            totalQuantity={totalQuantity}
            totalAmount={totalAmount}
            accountId={accountId}
            onAccountIdChange={setAccountId}
            onConfirmOrder={handleConfirmOrder}
            isCreating={isCreating}
            createError={createError}
            createSuccess={createSuccess}
          />
          
          {createSuccess && (
            <Link 
              to="/orders"
              className="block w-full text-center py-2 px-4 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition-colors"
            >
              View My Orders
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
