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

  //store filtered Items
  filteredItems: Item[] = [];

  //store cart count
  cartCount: number = 0;

  //items in cart
  cartItems: CartItem[] = [];

  //set to check if item is in cart
  cartItemIds = new Set<number>();

  loading: boolean = true;

  //clean up subscriptions
  private unsubscribe$ = new Subject<void>();

  constructor(private itemService: ItemService,
              private router: Router,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.loadItems()
    this.loadCategories()

    //subscribe to cart count
    this.cartService.cartItems$.pipe(takeUntil(this.unsubscribe$)).subscribe(cartItems => {
      this.cartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
      this.cartItems = cartItems;
      //update set only when cart changes
      this.cartItemIds = new Set(cartItems.map(cartItem => cartItem.id));
    })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadItems() {
    //old way
    // this.itemService.getItems().subscribe(items => this.items = items);

    //with cleanup
    this.itemService.getItems().pipe(takeUntil(this.unsubscribe$)).subscribe(
      items => {
        this.items = items;
        this.updateFilteredItems();
        this.loading = false;
      }
    )
  }

  loadCategories() {
    //old way
    // this.itemService.getCategories().subscribe(categories => this.categories = categories);

    //with cleanup
    this.itemService.getCategories().pipe(takeUntil(this.unsubscribe$)).subscribe(
      categories => this.categories = categories
    )
  }

  onEdit(item: Item) {
    // console.log('Edit clicked', item);
    this.router.navigate(['edit-item', item.id]);
  }

  onDelete(item: Item) {
   this.itemToDelete = item;
   this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      //old way
      // this.itemService.deleteItem(this.itemToDelete.id).subscribe(() => {
      // this.loadItems();
      // this.closeDeleteModal()
      // })

        //with cleanup
        const itemToDelete = this.itemToDelete;
        this.itemService.deleteItem(this.itemToDelete.id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.items = this.items.filter(item => item.id !== itemToDelete.id);
          //delete from cart as well
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
    // console.log('Add button clicked');
    this.router.navigate(['add-item']);
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.updateFilteredItems();
  }

  // get filteredItems(): Item[] {
  //   let filtered = this.items;
  //
  //
  //   if (this.selectedCategory !== 'All Items') {
  //     filtered = filtered.filter(item => item.category === this.selectedCategory);
  //   }
  //
  //
  //   if (this.nameFilter) {
  //     filtered = filtered.filter(item =>
  //       item.name.toLowerCase().includes(this.nameFilter.toLowerCase())
  //     );
  //   }
  //
  //
  //   if (this.priceFilter) {
  //     const price = parseFloat(this.priceFilter);
  //     filtered = filtered.filter(item => item.price === price);
  //   }
  //
  //   return filtered;
  // }

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
    // console.log('Filter applied:', this.nameFilter, this.priceFilter);
  }

  // isInCart(item: Item): boolean {
  //   // console.log('item in cart', item);
  //   return this.cartService.isInCart(item.id);
  // }

  onCartToggle(item: Item, checked: boolean): void {
    if (checked) {
      this.cartService.addToCart(item);
    } else {
      this.cartService.removeFromCart(item.id);
    }
  }

  // get cartCount(): number {
  //   return this.cartService.getCartCount();
  // }

  onGoToCart(): void {
    this.router.navigate(['/cart']).then();
  }

}
