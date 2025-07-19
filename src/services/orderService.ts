
import { Order, CartItem, Drink, Customizations } from '@/models/Drink';
import { apiRequest } from './api';

export class OrderService {
  static createOrderData(items: CartItem[], total: number) {
    return {
      items,
      total
    };
  }

  static createOrderToCart(drink: Drink, customizations: Customizations[]) {
    return {
      drink,
      customizations
    };
  }

  static async saveOrder(items: CartItem[], total: number): Promise<Order> {
    try {
      const orderData = this.createOrderData(items, total);
      const response = await apiRequest('POST', '/pedidos/criar', orderData);
      return response.data;
    } catch (error) {
      console.error('Save order error:', error);
      throw new Error('Falha ao salvar pedido. Tente novamente.');
    }
  }

  static async orderOnCart(drink: Drink, customizations: Customizations[])  {
    try {
      const orderItem = this.createOrderToCart(drink, customizations);
      console.log("Order item to cart:", orderItem);
      const response = await apiRequest('POST', '/pedidos/bebida/preparar', orderItem);
      return response.data;
    } catch (error) {
      console.error('Prepare order error:', error);
      throw new Error('Falha ao salvar item. Tente novamente.');
    }
  } 

  static async getOrderHistory(): Promise<Order[]> {
    try {
      const response = await apiRequest('GET', '/pedidos');
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
