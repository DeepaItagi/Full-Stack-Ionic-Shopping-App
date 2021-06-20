import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IOrderToCreate } from 'src/app/_models/order';
import { IProduct } from 'src/app/_models/product';
import { CartService } from 'src/app/_services/cart.service';
import { OrderService } from 'src/app/_services/order.service';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  products:IProduct[]=[];
  product:IProduct;
  quantity=1;
  isCartSet=this.cartService.isCartSet;

  constructor(
    private productsService:ProductsService,
    private cartService:CartService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    public toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadProduct();
    this.getProducts();
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  //Gets product by its Id.
  loadProduct() {
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
          loadingEl.present();
          this.productsService.getProduct(+this.activatedRoute.snapshot.paramMap.get('productId'))
        .subscribe((product) => 
        {
            this.product = product;
            console.log(this.product);
            loadingEl.dismiss();
        }, error => {
          console.log(error);
        });  
    });
    //this.product=this.products.find(p=> p.id  ===  (+this.activatedRoute.snapshot.paramMap.get('productId')));
  }
  

  //Adds items into cart. 
  addToCart() {

    this.loadingController
    .create({ message:"adding.."})
    .then(loadingEl => {
        loadingEl.present();

        this.cartService.addItemToCart(this.product, this.quantity);
        
          loadingEl.dismiss();
          this.presentToast();
        
        this.router.navigateByUrl('/home/tabs/cart');
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Added to cart successfully.',
      duration: 2000
    });
    toast.present();
  }
  
  //Gets all products.
  getProducts()
  {
    this.productsService.getProducts()
    .subscribe(products => {
      this.products=products;
      console.log(this.products)
    }, error => {
      console.log(error);
    });
  }

}
