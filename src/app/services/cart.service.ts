import { Injectable } from '@angular/core';
import {CartItem, Item} from "../interfaces";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // cartItems: any[] = [];

  //reactive cart
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  //get the current value of cartItems
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() { }

  addToCart(item: Item): void {
    //access the latest cart array
    const currentItems = this.cartItemsSubject.value;
    const existing = currentItems.find(cartItem => cartItem.id === item.id);

    if (existing) {
      existing.quantity++;
    } else {
      // currentItems.push({
      //   id: item.id,
      //   name: item.name,
      //   price: item.price,
      //   category: item.category,
      //   quantity: 1
      // });
      const cartItem: CartItem = {
        ...item,
        quantity: 1
      }
      currentItems.push(cartItem);
    }

    this.cartItemsSubject.next([...currentItems]);
  }

  updateItemInCart(updatedItem: Item): void {
    const currentItems = this.cartItemsSubject.value;
    // const existingItem = currentItems.find(cartItem => cartItem.id === updatedItem.id);
    //
    // if (existingItem) {
    //   existingItem.name = updatedItem.name;
    //   existingItem.price = updatedItem.price;
    //   existingItem.category = updatedItem.category;
    //   this.cartItemsSubject.next([...currentItems]);
    // }
    const updatedItems = currentItems.map(cartItem => cartItem.id === updatedItem.id ?
      {...updatedItem, quantity: cartItem.quantity} : cartItem);

    this.cartItemsSubject.next(updatedItems);
  }

  removeFromCart(itemId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(currentItems);
  }

  // isInCart(itemId: number): boolean {
  //   const currentItems = this.cartItemsSubject.value;
  //   return currentItems.some(item => item.id === itemId);
  // }

  getCartCount(): number {
    const currentItems = this.cartItemsSubject.value;
    return currentItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    const currentItems = this.cartItemsSubject.value;
    return currentItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
