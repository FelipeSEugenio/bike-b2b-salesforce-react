import React from 'react';
import AccountLookup from '@/components/account/AccountLookup';
import { AccountSummary } from '@/services/accountService';

export type DraftOrderItem = {
  bikeId: string;
  name: string;
  model: string;
  brand: string;
  unitPrice: number;
  quantity: number;
};

interface DraftOrderSidebarProps {
  items: DraftOrderItem[];
  onUpdateQuantity: (bikeId: string, delta: number) => void;
  onRemoveItem: (bikeId: string) => void;
  totalQuantity: number;
  totalAmount: number;
  selectedAccount: AccountSummary | null;
  onAccountChange: (account: AccountSummary | null) => void;
  onConfirmOrder: () => void;
  isCreating: boolean;
  createError: string | null;
  createSuccess: string | null;
}

const DraftOrderSidebar: React.FC<DraftOrderSidebarProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  totalQuantity,
  totalAmount,
  selectedAccount,
  onAccountChange,
  onConfirmOrder,
  isCreating,
  createError,
  createSuccess,
}) => {
  const isButtonDisabled = items.length === 0 || !selectedAccount || isCreating;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border flex flex-col h-fit sticky top-24 transition-all duration-200">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Draft Order
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto max-h-[50vh] p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic text-sm">
            Your order is empty. Add bikes from the catalog to start.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.bikeId} className="flex flex-col pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.model}</p>
                </div>
                {!isCreating && (
                  <button 
                    onClick={() => onRemoveItem(item.bikeId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onUpdateQuantity(item.bikeId, -1)}
                    disabled={item.quantity <= 1 || isCreating}
                    className="w-7 h-7 flex items-center justify-center rounded border border-border text-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent transition-all outline-none"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold w-6 text-center text-foreground">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.bikeId, 1)}
                    disabled={isCreating}
                    className="w-7 h-7 flex items-center justify-center rounded border border-border text-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent transition-all outline-none"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm font-bold text-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice * item.quantity)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-muted/30 rounded-b-lg border-t border-border space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Account Lookup
          </label>
          <AccountLookup
            value={selectedAccount}
            onChange={onAccountChange}
            disabled={isCreating}
          />
        </div>

        {createError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive font-medium">
            <strong>Error:</strong> {createError}
          </div>
        )}

        {createSuccess && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-600 dark:text-green-400 font-medium">
            {createSuccess}
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Items:</span>
            <span className="font-semibold text-foreground">{totalQuantity}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-foreground mb-4">
            <span>Total:</span>
            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}</span>
          </div>
          
          <button
            onClick={onConfirmOrder}
            disabled={isButtonDisabled}
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Order...
              </>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftOrderSidebar;
