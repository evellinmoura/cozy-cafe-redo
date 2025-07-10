
import { useCallback } from 'react';
import { OrderService } from '@/services/orderService';
import { CartItem } from '@/models/Drink';

export const useOrder = () => {
  const processOrder = useCallback((items: CartItem[], total: number) => {
    const order = OrderService.createOrder(items, total);
    OrderService.saveOrder(order);
    return order;
  }, []);

  const getOrderHistory = useCallback(() => {
    return OrderService.getOrderHistory();
  }, []);

  return {
    processOrder,
    getOrderHistory
  };
};
