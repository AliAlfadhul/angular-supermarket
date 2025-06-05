import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Item, Category, CartItem} from "./interfaces";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const items = [
      { id: 1, name: 'White Bread', price:0.3, category:"Bakery" },
      { id: 2, name: 'Mega Chips', price:0.1, category:"Snacks" },
      { id: 3, name: 'Croissant', price:0.1, category:"Bakery" },
      { id: 4, name: 'Alsi Cola', price:0.25, category:"Drinks" },
      { id: 5, name: 'Biscuit', price:0.2, category:"Snacks" },
      { id: 6, name: 'Viva', price:0.3, category:"Drinks" },
      { id: 7, name: 'OK Chips', price:0.1, category:"Snacks" },
      { id: 8, name: 'Cheese Sandwich', price:0.35, category:"Bakery" },
      { id: 9, name: 'Cup Cake', price:0.5, category:"Bakery" },
    ];
    const categories = [
      { id: 11, name: 'Bakery' },
      { id: 12, name: 'Drinks' },
      { id: 13, name: 'Snacks' },
    ];
    const cartItems: CartItem[] = [];

    //add cart items to store cart items and use http services
    return {items, categories, cartItems};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(elements: Item[] | Category[] | CartItem[]): number {
    return elements.length > 0 ? Math.max(...elements.map(element => element.id)) + 1 : 1;
  }
}
