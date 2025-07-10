
import { Order, CartItem } from '@/models/Drink';
import { apiRequest } from './api';

export class OrderService {
  static createOrderData(items: CartItem[], total: number) {
    return {
      items,
      total
    };
  }

  static async saveOrder(items: CartItem[], total: number): Promise<Order> {
    try {
      const orderData = this.createOrderData(items, total);
      const response = await apiRequest('POST', '/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Save order error:', error);
      throw new Error('Falha ao salvar pedido. Tente novamente.');
    }
  }

  static async getOrderHistory(): Promise<Order[]> {
    try {
      const response = await apiRequest('GET', '/orders');
      return response.data;
    } catch (error) {
      console.error('Get order history error:', error);
      // Fallback para localStorage em caso de erro
      try {
        const ordersData = localStorage.getItem('orderHistory');
        return ordersData ? JSON.parse(ordersData) : [];
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return [];
      }
    }
  }
}
