import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {Category, Item} from "../interfaces";


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemsUrl = 'api/items';
  private categoriesUrl = 'api/categories';

  constructor(private http: HttpClient) { }

  getItems():Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl);
  }

  getItem(id: number):Observable<Item> {
    return this.http.get<Item>(`${this.itemsUrl}/${id}`);
  }

  getCategories():Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  addItem(item: Item):Observable<Item> {
    return this.http.post<Item>(this.itemsUrl, item);
  }

  updateItem(item: Item):Observable<Item> {
    return this.http.put<Item>(`${this.itemsUrl}/${item.id}`, item);
  }

  deleteItem(id: number):Observable<{}> {
    return this.http.delete(`${this.itemsUrl}/${id}`);
  }
}
