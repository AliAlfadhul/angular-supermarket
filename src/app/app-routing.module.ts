import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ItemFormComponent} from "./components/item-form/item-form.component";
import {CartComponent} from "./components/cart/cart.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  { path: 'add-item', component: ItemFormComponent },
  { path: 'edit-item/:id', component: ItemFormComponent },
  { path: 'cart', component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
