import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/product';
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
    if (this.token != null) {
      this.getAllSortedOrders(this.token);
    }
  }

  selectProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  getAllSortedOrders(token: string): void {
    this.orderService.getAllSortedUsersOrders().subscribe(response => {
      this.response = response;
    })
  }

  getAllOrders(token: string): void {
    this.orderService.getAllOrders(token).subscribe(orders => {
      this.response = orders;
    })
  }

}
