import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  //Take input from cart and dashboard (default type is dashboard)
  @Input() item: any;
  @Input() type: 'dashboard' | 'cart' = 'dashboard';
  @Input() isInCart: boolean = false;

  //Take event clicks from cart and dashboard
  @Output() editClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() cartToggleClick = new EventEmitter();
  //cart events
  @Output() removeItemClick = new EventEmitter();
  @Output() quantityChangeEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
