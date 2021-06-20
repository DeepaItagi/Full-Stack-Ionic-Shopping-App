import { Component, OnInit ,Input,Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products:IProduct[]=[];
  
  constructor(
    private productsService : ProductsService,
    public activatedRoute:ActivatedRoute,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  //Gets all products from database and filters products by Category Id.
  getProducts()
  {
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
            this.productsService.getProducts()
            .pipe(
             map(products => {
              this.products=products.filter(p => p.categoryId === (+this.activatedRoute.snapshot.paramMap.get('id'))) ;
          }))
          .subscribe(()=>
          { 
            loadingEl.dismiss();
          }, error => {
            console.log(error);
          });   
    });
    
  }
}
