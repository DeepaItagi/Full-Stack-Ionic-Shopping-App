import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ICart, ICartItem, ICartTotals } from 'src/app/_models/cart';
import { IOrderItem } from 'src/app/_models/order';
import { IProduct } from 'src/app/_models/product';
import { CartService } from 'src/app/_services/cart.service';
import { OrderService } from 'src/app/_services/order.service';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  product:IProduct[]=[];
  cart$: Observable<ICart>;
  cartTotals$: Observable<ICartTotals>;
  item: ICart;

  constructor(
    private cartService: CartService,
    private orderService:OrderService,
    private router:Router,
    private loadingController: LoadingController,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cartTotals$ = this.cartService.cartTotal$;
    this.getCart();
  }

  //Gets the cart from Redis database.
  getCart() {
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
      this.cartService.getCart(cartId).subscribe(() => {
        console.log('initialised basket');
      }, error => {
        console.log(error);
      });
    }
  }
  

  incrementItemQuantity(item: ICartItem) {
    this.cartService.incrementItemQuantity(item);
  }

  decrementItemQuantity(item: ICartItem) {
    this.cartService.decrementItemQuantity(item);
  }
  
  //Removes single item from cart.
  removeFromCart(item)
  {
    this.cartService.removeItemFromCart(item);
  }

  //Creates orders.
   createOrder()
  { 
    const cart = this.cartService.getCurrentCartValue();
    try {
      const orderToCreate = this.getOrderToCreate(cart);

      this.loadingController
      .create({ message:"placing order.."})
      .then(loadingEl => {
            loadingEl.present();
            this.orderService.creatOrder(orderToCreate).subscribe(()=>{
              this.cartService.deleteCart(cart);
              loadingEl.dismiss();
              this.presentToast();
              this.router.navigate(["/home/orders"]);
            });       
      });     
    } 
    catch (error) {
      console.log(error);
    }
  }

  private getOrderToCreate(cart: ICart) {
    return {
      cartId: cart.id
    };
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Order placed successfully.',
      duration: 2000
    });
    toast.present();
  }


//Deletes cart from Redis database.
  deleteCart(item)
  {
    this.loadingController
    .create({ message:"deleting.."})
    .then(loadingEl => {
      loadingEl.present();
      this.cartService.deleteCart(item);
      loadingEl.dismiss();
    });
  }
}
