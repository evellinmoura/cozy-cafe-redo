
export interface Drink {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface Customization {
  name: string;
  price: number;
}

export interface CartItem {
  drink: Drink;
  quantity: number;
  customizations: Customization[];
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
}
