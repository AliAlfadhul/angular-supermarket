import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../services/item.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit, OnDestroy {

  itemForm: FormGroup;
  categories: any[] = [];
  isEdit = false;
  itemId = 0;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private cartService: CartService
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.itemId = +id;
      this.loadItem();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCategories(): void {
    this.itemService.getCategories().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.categories = data;
    });
  }

  loadItem(): void {
    this.itemService.getItem(this.itemId).pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
      this.itemForm.patchValue(item);
    });
  }

  onSave(): void {
    if (this.itemForm.valid) {
      const item = this.itemForm.value;

      if (this.isEdit) {
        item.id = this.itemId;
        this.itemService.updateItem(item).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          //update cart with new data
          this.cartService.updateItemInCart(item)
          this.router.navigate(['/']);
        });
      } else {
        this.itemService.addItem(item).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    } else {
      // SHOW VALIDATION ERRORS
      this.itemForm.markAllAsTouched();
      console.log('Form is invalid!');
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
