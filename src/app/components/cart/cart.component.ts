import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.cartItems;
  }

  onQuantityChange(itemId: number, event: any): void {
    const newQuantity = parseInt(event.target.value);
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
    }
  }

  onRemoveItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
    this.cartItems = this.cartService.cartItems;
  }

  onBackToDashboard(): void {
    this.router.navigate(['/']).then();
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }
}
