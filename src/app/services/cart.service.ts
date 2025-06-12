import { Injectable } from '@angular/core';
import {CartItem, Item} from "../interfaces";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ItemService} from "./item.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //cartItems: any[] = [];

  //reactive cart
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  //get the current value of cartItems
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartUrl = 'api/cartItems';

  //store items
  private items: Item[] = [];

  //prevent rapid click bug
  private isProcessing = false;

  constructor(private http: HttpClient, private itemService: ItemService) {
    this.loadCartItems();
    this.loadItems();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.cartUrl);
  }

  addToCartItem(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.cartUrl, item);
  }

  deleteFromCartItem(cartItemId: number): Observable<CartItem> {
    return this.http.delete<CartItem>(`${this.cartUrl}/${cartItemId}`);
  }

  updateCartItem(item: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.cartUrl}/${item.id}`, item);
  }

  loadCartItems() {

    this.getCartItems().subscribe(cartItems => {
      this.cartItemsSubject.next(cartItems);
    });

  }

  loadItems() {

    this.itemService.getItems().subscribe(items => {
      this.items = items;
      this.cartItemsSubject.next([...this.cartItemsSubject.value]);
    });

  }

  //to join cart items with item details
  getCartItemsDetails(): any[]{

    const cartItems = this.cartItemsSubject.value;

    return cartItems.map(cartItem => {
      const item = this.items.find(item=> item.id === cartItem.itemId);
      //merge with adding unique identifier
      return{
        ...cartItem,
        ...item,
        id: cartItem.id
      };
    }).filter(item => item.name);
  }

  refreshItems() {
    this.loadItems()
  }

  addToCart(item: Item): void {

    if(this.isProcessing) return;

    const exists = this.cartItemsSubject.value.
    find(cartItem => cartItem.itemId === item.id);

    if(exists) return;

    this.isProcessing = true;

    const cartItem: any = {
      itemId: item.id,
      quantity: 1
    }

    this.addToCartItem(cartItem).subscribe({
      //prevent bugs on multiple rapid clicks
      next: (addedCartItem)=> {
        const currentCartItems = this.cartItemsSubject.value
        currentCartItems.push(addedCartItem);
        this.cartItemsSubject.next([...currentCartItems]);
        this.isProcessing = false;
    }, error: () => {
        this.isProcessing = false;
      }
    });

  }

  updateQuantity(cartItemId: number, newQuantity: number): void {

    const currentCartItems = this.cartItemsSubject.value;
    const cartItemIndex = currentCartItems.findIndex(item => item.id === cartItemId);

    if (cartItemIndex !== -1) {
      currentCartItems[cartItemIndex].quantity = newQuantity;
      this.cartItemsSubject.next([...currentCartItems]);
      this.updateCartItem(currentCartItems[cartItemIndex]).subscribe();
    }

  }

  removeFromCart(itemId: number): void {

    const currentCartItems = this.cartItemsSubject.value;
    const cartItem = currentCartItems.find(cartItem => cartItem.itemId === itemId);

    if(cartItem) {
      this.deleteFromCartItem(cartItem.id).subscribe(() =>{
        const filteredItems = currentCartItems.filter(item => item.id !== cartItem.id);
        this.cartItemsSubject.next(filteredItems);
      })
    }

  }

  getTotalPrice(): number {

    const cartItemsWithDetail = this.getCartItemsDetails();

    return cartItemsWithDetail.reduce((total, item) => {
      if (item.price && item.quantity) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);

  }

}
