import React, { useState, useMemo } from 'react';
import { useBikeCatalog } from '@/services/bikeService';
import { createOrderWithItems } from '@/services/orderMutationService';
import { AccountSummary } from '@/services/accountService';
import CatalogFilters from './CatalogFilters';
import DraftOrderSidebar, { DraftOrderItem } from './DraftOrderSidebar';
import { Link } from 'react-router';

const CatalogPage: React.FC = () => {
  const { bikes, loading, error } = useBikeCatalog();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [draftItems, setDraftItems] = useState<DraftOrderItem[]>([]);
  
  // Mutation states
  const [selectedAccount, setSelectedAccount] = useState<AccountSummary | null>(null);
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
        bike.model.toLowerCase().includes(searchText.toLowerCase());

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
        model: bike.model,
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
    if (draftItems.length === 0 || !selectedAccount) return;

    try {
      setIsCreating(true);
      setCreateError(null);
      setCreateSuccess(null);

      const result = await createOrderWithItems({
        accountId: selectedAccount.id,
        status: 'Draft',
        items: draftItems,
        totalAmount
      });

      setCreateSuccess(`Order ${result.orderId} created successfully for ${selectedAccount.name}!`);
      setDraftItems([]);
      setSelectedAccount(null);
    } catch (err) {
      console.error('Failed to create order:', err);
      setCreateError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Bike Catalog</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">Browse our available bike models and build your purchase order draft.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
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
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="text-muted-foreground text-sm font-medium">Loading catalog...</span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-card border border-border rounded-lg p-4 flex gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-muted rounded-md shrink-0"></div>
                    <div className="flex-grow space-y-2 py-1">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex gap-3 text-destructive">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="text-sm font-medium">
                Something went wrong while loading the catalog: <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && bikes.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center shadow-sm">
              <p className="text-muted-foreground text-base">No bikes found in the catalog.</p>
            </div>
          )}

          {!loading && !error && bikes.length > 0 && filteredBikes.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center shadow-sm">
              <p className="text-muted-foreground text-base">No bikes match your filters.</p>
              <button
                onClick={() => {
                  setSearchText('');
                  setSelectedBrand('all');
                }}
                className="mt-4 text-primary hover:text-primary/85 font-semibold text-sm transition-colors cursor-pointer border-none bg-transparent"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && filteredBikes.length > 0 && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all duration-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image</th>
                        <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                        <th className="px-6 py-4.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-4.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredBikes.map((bike) => (
                        <tr key={bike.id} className="hover:bg-muted/30 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {bike.imageUrl ? (
                              <img
                                src={bike.imageUrl}
                                alt={bike.name}
                                className="object-cover rounded-md border border-border"
                                style={{ width: '64px', height: '64px' }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center border border-border text-muted-foreground font-bold text-xs uppercase">
                                {bike.name.slice(0, 2)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-foreground">{bike.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">{bike.model}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground border border-border">
                              {bike.brand}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-bold text-foreground">
                              {bike.displayPrice || `$${bike.price.toFixed(2)}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              disabled={isCreating}
                              onClick={() => handleAddToOrder(bike.id)}
                              className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-semibold rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 cursor-pointer"
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

              {/* Mobile Cards View */}
              <div className="md:hidden flex flex-col gap-4">
                {filteredBikes.map((bike) => (
                  <div key={bike.id} className="bg-card border border-border rounded-lg p-4 shadow-sm flex items-start gap-4 transition-all duration-200">
                    {bike.imageUrl ? (
                      <img
                        src={bike.imageUrl}
                        alt={bike.name}
                        className="w-16 h-16 object-cover rounded-md border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center border border-border text-muted-foreground font-bold text-xs uppercase shrink-0">
                        {bike.name.slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-grow min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        <h3 className="text-sm font-bold text-foreground truncate">{bike.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{bike.brand} &bull; {bike.model}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-sm font-extrabold text-foreground">
                          {bike.displayPrice || `$${bike.price.toFixed(2)}`}
                        </span>
                        <button
                          disabled={isCreating}
                          onClick={() => handleAddToOrder(bike.id)}
                          className="px-3 py-1 bg-primary text-primary-foreground font-bold text-xs rounded shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full space-y-4 lg:sticky lg:top-24">
          <DraftOrderSidebar
            items={draftItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            totalQuantity={totalQuantity}
            totalAmount={totalAmount}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
            onConfirmOrder={handleConfirmOrder}
            isCreating={isCreating}
            createError={createError}
            createSuccess={createSuccess}
          />
          
          {createSuccess && (
            <Link 
              to="/orders"
              className="block w-full text-center py-2 px-4 border border-primary text-primary font-semibold text-sm rounded hover:bg-primary/5 transition-all"
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
