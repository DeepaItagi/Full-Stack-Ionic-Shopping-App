import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cart, ICart, ICartItem, ICartTotals } from '../_models/cart';
import { IProduct } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.apiUrl;
  
  private cartSource = new BehaviorSubject<ICart>(null);
  cart$ = this.cartSource.asObservable();
  
  private cartTotalSource = new BehaviorSubject<ICartTotals>(null);
  cartTotal$ = this.cartTotalSource.asObservable();
  shipping = 0;
  isCartSet=false;

  constructor(private http: HttpClient) { }

  //Gets cart from Redis database.
  getCart(id: string) {
    return this.http.get(this.baseUrl + 'cart?id=' + id)
      .pipe(
        map((cart: ICart) => {
          this.cartSource.next(cart);
          if(this.cartSource)
          {this.calculateTotals();}
        })
      );
  }

  //Saves the cart into Redis database
  setCart(cart: ICart) {
    this.isCartSet=true;
    return this.http.post(this.baseUrl + 'cart', cart).subscribe((response: ICart) => {
      
      this.cartSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  //Returns current cart value.
  getCurrentCartValue() {
    return this.cartSource.value;
  }

  //Adds item to cart
  addItemToCart(item: IProduct, quantity = 1) {
    const itemToAdd: ICartItem = this.mapProductItemToCartItem(item, quantity);
    let cart = this.getCurrentCartValue();
    if (cart === null) {
      cart = this.createCart();
    }
    cart.items = this.addOrUpdateItem(cart.items, itemToAdd, quantity);
    this.setCart(cart);
  }

  //Increments item quantity.
  incrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex(x => x.id === item.id);
    cart.items[itemIndex].quantity++;
    this.setCart(cart);
  }

  //Decrements item quantity.
  decrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex(x => x.id === item.id);
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity--;
      this.setCart(cart);
    } else {
      this.removeItemFromCart(item);
    }
  }

  //Removes single item from cart.
  removeItemFromCart(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    if (cart.items.some(x => x.id === item.id)) {
      cart.items = cart.items.filter(i => i.id !== item.id);
      if (cart.items.length > 0) {
        this.setCart(cart);
      } else {
        this.deleteCart(cart);
      }
    }
  }

  //Deletes cart id from localStorage.
  deleteLocalCart(id: string) {
    this.cartSource.next(null);
    this.cartTotalSource.next(null);
    localStorage.removeItem('cart_id');
  }

  //Deletes whole cart from Redis database.
  deleteCart(cart: ICart) {
    return this.http.delete(this.baseUrl + 'cart?id=' + cart.id).subscribe(() => {
      this.cartSource.next(null);
      this.cartTotalSource.next(null);
      localStorage.removeItem('cart_id');
    }, error => {
      console.log(error);
    });
  }

  //Calculates total value.
  private calculateTotals() {
    const cart = this.getCurrentCartValue();
    const shipping = this.shipping;
    const subtotal = cart.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.cartTotalSource.next({shipping, total, subtotal});
  }

  //Adds a new item. If item already exists in cart, updates its quantity.
  private addOrUpdateItem(items: ICartItem[], itemToAdd: ICartItem, quantity: number): ICartItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  //Saves Cart Id into localStorage.
  private createCart(): ICart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  //Maps product item into cart item.
  private mapProductItemToCartItem(item: IProduct, quantity: number): ICartItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity,
      categoryId: item.categoryId
    };
  }

  
}
