import { Injectable } from '@angular/core';
import {Item} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: any[] = [];

  constructor() { }

  addToCart(item: Item): void {
    const existing = this.cartItems.find(cartItem => cartItem.id === item.id);

    if (existing) {
      existing.quantity++;
    } else {
      this.cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: 1
      });
    }
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  isInCart(itemId: number): boolean {
    return this.cartItems.some(item => item.id === itemId);
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
