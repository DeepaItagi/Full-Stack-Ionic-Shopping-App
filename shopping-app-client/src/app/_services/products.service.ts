import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../_models/category';
import { IProduct } from '../_models/product';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  category: ICategory[] = [];

  constructor(private http: HttpClient) { }

  //Gets all products.
  getProducts() 
  {
    return this.http.get<IProduct[]>(this.baseUrl + 'products')
  }

  //Gets a product by Id.
  getProduct(id)
  {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  //Gets all categories.
  getCategories() 
  {
    return this.http.get<ICategory[]>(this.baseUrl + 'products/categories').pipe(
      map(response => {
        this.category = response;
        return response;
      })
    );
  }

}
