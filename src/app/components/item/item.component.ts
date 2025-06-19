import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {


  @Input() item: any;
  @Input() type: 'dashboard' | 'cart' = 'dashboard';
  @Input() isInCart: boolean = false;


  @Output() editClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() cartToggleClick = new EventEmitter();

  @Output() removeItemClick = new EventEmitter();
  @Output() quantityChangeEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCartToggleChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.cartToggleClick.emit({
      item: this.item,
      checked: checkbox.checked,
    });
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantityChangeEvent.emit({
      cartItemId: this.item.id,
      value: input.value,
    })
  }

  onEditClick(): void {
    this.editClick.emit(this.item);
  }

  onDeleteClick(): void {
    this.deleteClick.emit(this.item);
  }

  onRemoveClick(): void {
    this.removeItemClick.emit(this.item.id);
  }

}
