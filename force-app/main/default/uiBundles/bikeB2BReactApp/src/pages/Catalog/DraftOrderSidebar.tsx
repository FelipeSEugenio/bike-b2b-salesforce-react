import React from 'react';
import AccountLookup from '@/components/account/AccountLookup';
import { AccountSummary } from '@/services/accountService';

export type DraftOrderItem = {
  bikeId: string;
  name: string;
  code: string;
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-fit sticky top-24">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Draft Order
        </h2>
      </div>

      <div className="flex-grow overflow-y-auto max-h-[50vh] p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic">
            Your order is empty. Add bikes from the catalog to start.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.bikeId} className="flex flex-col pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.code}</p>
                </div>
                {!isCreating && (
                  <button 
                    onClick={() => onRemoveItem(item.bikeId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
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
                    className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.bikeId, 1)}
                    disabled={isCreating}
                    className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice * item.quantity)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Account Lookup
          </label>
          <AccountLookup
            value={selectedAccount}
            onChange={onAccountChange}
            disabled={isCreating}
          />
        </div>

        {createError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <strong>Error:</strong> {createError}
          </div>
        )}

        {createSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700">
            {createSuccess}
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Items:</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
            <span>Total:</span>
            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}</span>
          </div>
          
          <button
            onClick={onConfirmOrder}
            disabled={isButtonDisabled}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
