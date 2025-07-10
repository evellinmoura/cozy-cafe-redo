
import { Order, CartItem } from '@/models/Drink';

export class OrderService {
  private static readonly ORDER_HISTORY_KEY = 'orderHistory';

  static createOrder(items: CartItem[], total: number): Order {
    return {
      id: Date.now().toString(),
      items,
      total,
      date: new Date().toISOString(),
      status: "Concluído"
    };
  }

  static saveOrder(order: Order): void {
    try {
      const existingOrders = this.getOrderHistory();
      const updatedOrders = [order, ...existingOrders];
      localStorage.setItem(this.ORDER_HISTORY_KEY, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }

  static getOrderHistory(): Order[] {
    try {
      const ordersData = localStorage.getItem(this.ORDER_HISTORY_KEY);
      return ordersData ? JSON.parse(ordersData) : [];
    } catch (error) {
      console.error('Error parsing order history:', error);
      return [];
    }
  }
}
