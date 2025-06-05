import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import {CartItem} from "../../interfaces";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(data => {
      this.cartItems = data;
    });
  }

  onQuantityChange(itemId: number, value: string): void {
    const newQuantity = parseInt(value);
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
    }
  }

  onRemoveItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  onBackToDashboard(): void {
    this.router.navigate(['/']).then();
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }
}
