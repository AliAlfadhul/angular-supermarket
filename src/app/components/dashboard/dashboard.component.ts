import {Component, OnDestroy, OnInit} from '@angular/core';

import {ItemService} from "../../services/item.service";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem, Category, Item} from "../../interfaces";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  items: Item[] = [];
  categories: Category[] =[];
  selectedCategory: string = 'All Items';

  nameFilter: string = '';
  priceFilter: string = '';

  nameInput: string = '';
  priceInput: string = '';

  showDeleteModal = false
  itemToDelete: Item | null = null;

  filteredItems: Item[] = [];

  cartCount: number = 0;

  cartItems: CartItem[] = [];

  cartItemIds = new Set<number>();

  loading: boolean = true;

  private unsubscribe$ = new Subject<void>();

  constructor(private itemService: ItemService,
              private router: Router,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.loadItems()
    this.loadCategories()

    this.cartService.cartItems$.pipe(takeUntil(this.unsubscribe$)).subscribe(cartItems => {
      this.cartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
      this.cartItems = cartItems;
      this.cartItemIds = new Set(cartItems.map(cartItem => cartItem.itemId));
    })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadItems() {
    this.itemService.getItems().pipe(takeUntil(this.unsubscribe$)).subscribe(
      items => {
        this.items = items;
        this.updateFilteredItems();
        this.loading = false;
      }
    )
  }

  loadCategories() {
    this.itemService.getCategories().pipe(takeUntil(this.unsubscribe$)).subscribe(
      categories => this.categories = categories
    )
  }

  onEdit(item: Item) {
    this.router.navigate(['edit-item', item.id]);
  }

  onDelete(item: Item) {
   this.itemToDelete = item;
   this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
        const itemToDelete = this.itemToDelete;
        this.itemService.deleteItem(this.itemToDelete.id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.items = this.items.filter(item => item.id !== itemToDelete.id);
          this.cartService.removeFromCart(itemToDelete.id)
          this.updateFilteredItems()
          this.closeDeleteModal()
        })

      }
    }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  onAdd() {
    this.router.navigate(['add-item']);
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.updateFilteredItems();
  }

  updateFilteredItems() {
    let filtered = this.items;

      if (this.selectedCategory !== 'All Items') {
        filtered = filtered.filter(item => item.category === this.selectedCategory);
      }

      if (this.nameFilter) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(this.nameFilter.toLowerCase())
        );
      }

      if (this.priceFilter) {
        const price = parseFloat(this.priceFilter);
        filtered = filtered.filter(item => item.price === price);
      }

      this.filteredItems = filtered;

  }

  onFilter(): void {
    this.nameFilter = this.nameInput;
    this.priceFilter = this.priceInput;
    this.updateFilteredItems();
  }

  onCartToggle(item: Item, checked: boolean): void {
    if (checked) {
      this.cartService.addToCart(item);
    } else {
      this.cartService.removeFromCart(item.id);
    }
  }

  onGoToCart(): void {
    this.router.navigate(['/cart']).then();
  }

}
