import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/_models/category';
import { IProduct } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  categories:ICategory[];
  
  constructor(
    private productsService : ProductsService,
    private loadingController: LoadingController,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  //Gets all categories.
  getCategories()
  {
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
      this.productsService.getCategories().subscribe(response => {
        this.categories =response;
        loadingEl.dismiss();
        console.log(this.categories);
      }, error => {
        console.log(error);
      });
      });
  }
}
