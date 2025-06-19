import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import {CartItem} from "../../interfaces";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems: any[] = [];

  private destroy$ = new Subject<void>();


  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void{
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cartItems = this.cartService.getCartItemsDetails();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onQuantityChange(cartItemId: number, value: string): void {
    const newQuantity = parseInt(value);
    if (newQuantity > 0) {
      this.cartService.updateQuantity(cartItemId, newQuantity);
    }
  }

  onRemoveItem(cartItemId: number): void {
    const cartItem: CartItem = this.cartItems.find(item => item.id === cartItemId);
    if (cartItem) {
      this.cartService.removeFromCart(cartItem.itemId)
    }
  }

  onBackToDashboard(): void {
    this.router.navigate(['/']).then();
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }
}
