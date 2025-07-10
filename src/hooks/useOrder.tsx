
import { useState, useCallback } from 'react';
import { OrderService } from '@/services/orderService';
import { CartItem, Order } from '@/models/Drink';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processOrder = useCallback(async (items: CartItem[], total: number): Promise<Order> => {
    try {
      setLoading(true);
      setError(null);
      const order = await OrderService.saveOrder(items, total);
      return order;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderHistory = useCallback(async (): Promise<Order[]> => {
    try {
      setLoading(true);
      setError(null);
      const orders = await OrderService.getOrderHistory();
      return orders;
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    processOrder,
    getOrderHistory
  };
};
