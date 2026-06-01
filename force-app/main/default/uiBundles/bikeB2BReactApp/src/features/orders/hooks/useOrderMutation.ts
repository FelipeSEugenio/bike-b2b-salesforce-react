import { useState } from 'react';
import { createOrderWithItems } from '../services/orderMutationService';
import { CreateOrderInput } from '../types';

export function useOrderMutation() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const createOrder = async (input: CreateOrderInput, accountName: string) => {
    try {
      setIsCreating(true);
      setCreateError(null);
      setCreateSuccess(null);

      const result = await createOrderWithItems(input);

      setCreateSuccess(`Order ${result.orderId} created successfully for ${accountName}!`);
      return { success: true, orderId: result.orderId };
    } catch (err) {
      console.error('Failed to create order:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setCreateError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
    }
  };

  const clearStatus = () => {
    setCreateError(null);
    setCreateSuccess(null);
  };

  return {
    createOrder,
    isCreating,
    createError,
    createSuccess,
    clearStatus
  };
}
