
export interface Drink {
  id: string;
  nome: string;
  preco_base: number;
  image: string;
  description: string;
}

export interface Customization {
  name: string;
  price: number;
}

export interface Customizations {
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

export interface Ingredient {
  id: string;
  nome: string;
  preco_adicional: number;
}
