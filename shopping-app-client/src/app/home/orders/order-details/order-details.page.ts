import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IOrder, IOrderItem } from 'src/app/_models/order';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  order:IOrderItem[]=[];
 // orderId:number;
 orders:IOrder;
  
  constructor(
    private orderService:OrderService,
    private activatedRoute:ActivatedRoute,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getOrderById();
  }

  //Gets an order by id.
  getOrderById()
  {
    this.orderService.getOrderDetailed(+this.activatedRoute.snapshot.paramMap.get('id'))
    .subscribe((orderDetailed:IOrder)=>
    {
      this.order=orderDetailed.orderItems;
    });
  }

}
