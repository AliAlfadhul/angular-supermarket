export interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  itemId: number;
  quantity: number;
}
