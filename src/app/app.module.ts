import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CartComponent } from './components/cart/cart.component';
import { ItemComponent } from './components/item/item.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ItemFormComponent,
    CartComponent,
    ItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
