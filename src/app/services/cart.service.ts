import { Injectable } from '@angular/core';
import {CartItem, Item} from "../interfaces";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // cartItems: any[] = [];

  //reactive cart
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  //get the current value of cartItems
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartUrl = 'api/cartItems';

  constructor(private http: HttpClient) {
    this.loadCartItems()
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.cartUrl);
  }

  addToCartItem(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.cartUrl, item);
  }

  deleteFromCartItem(itemId: number): Observable<CartItem> {
    return this.http.delete<CartItem>(`${this.cartUrl}/${itemId}`);
  }

  updateCartItem(item: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(this.cartUrl, item);
  }

  loadCartItems() {
    this.getCartItems().subscribe(cartItems => {
      this.cartItemsSubject.next(cartItems);
    });
  }

  addToCart(item: Item): void {
    // const currentItems = this.cartItemsSubject.value;
    const cartItem: CartItem = {
      ...item,
      quantity: 1
    }
    // currentItems.push(cartItem);
    // this.cartItemsSubject.next([...currentItems]);
    this.addToCartItem(cartItem).subscribe(cartItem => {
      // this.loadCartItems();
      const currentCartItems = this.cartItemsSubject.value
      currentCartItems.push(cartItem);
      this.cartItemsSubject.next([...currentCartItems]);
    });
  }

  updateItemInCart(updatedItem: Item): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(cartItem => cartItem.id === updatedItem.id);

    // if (existingItem) {
    //   existingItem.name = updatedItem.name;
    //   existingItem.price = updatedItem.price;
    //   existingItem.category = updatedItem.category;
    //   this.cartItemsSubject.next([...currentItems]);
    // }
    if (existingItem) {

      const updatedCartItem: CartItem = {
        ...updatedItem,
        quantity: existingItem.quantity
      };

      this.updateCartItem(updatedCartItem).subscribe(savedItem => {
        // this.loadCartItems();
        const currentCartItems = this.cartItemsSubject.value
        const index = currentCartItems.findIndex(cartItem => cartItem.id === savedItem.id);
        if (index !== -1) {
          currentCartItems[index] = savedItem
          this.cartItemsSubject.next([...currentCartItems]);
        }
      })

    }
  }

  removeFromCart(itemId: number): void {
    // const currentItems = this.cartItemsSubject.value.filter(item => item.id !== itemId);
    // this.cartItemsSubject.next(currentItems);
    this.deleteFromCartItem(itemId).subscribe(() =>{
      const currentCartItems = this.cartItemsSubject.value
      const filteredItems = currentCartItems.filter(item => item.id !== itemId);
      this.cartItemsSubject.next(filteredItems);
    })
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
