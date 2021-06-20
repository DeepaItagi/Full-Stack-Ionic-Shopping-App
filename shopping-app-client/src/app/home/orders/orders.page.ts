import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { IOrder } from 'src/app/_models/order';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders:IOrder[];

  constructor(
    private orderService:OrderService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
     this.getOrders();
  }

  //Gets all orders.
  getOrders(){

    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
      this.orderService.getOrdersForUser().subscribe((orders:IOrder[])=>{
        this.orders=orders;
        console.log("Getting orders..");
        console.log(this.orders);
        loadingEl.dismiss();
      },error => {
        console.log(error);
      });
    });
    }

    //Delets an order by id.
    deleteOrder(id){

      this.loadingController
      .create({ message:"deleting..."})
      .then(loadingEl => {
          loadingEl.present();
          this.orderService.deleteOrder(id).subscribe(()=>
          {
            loadingEl.dismiss();
            this.getOrders();
          });
    });
    }

}
