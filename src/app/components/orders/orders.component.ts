import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  response!: any;
  product!: Product;
  token!: string | null;
  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if(this.token != null) {
      this.getAllOrders(this.token);
    }
  }
  
  selectProduct(id: number): void {
    console.log(id);
    this.router.navigate(['/product', id]);
  }

  getAllOrders(token: string): void {
    this.orderService.getAllOrders(token).subscribe(orders=> {
      this.response = orders;
      // Date date = new Date(this.response[0].createdDate);
      console.log(this.response[0].createdDate)
    })
  }

}
