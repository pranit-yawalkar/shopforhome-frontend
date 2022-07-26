import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user/user';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  response!: any;
  token!: string | null;
  user!: User;
  map: any = {};


  constructor(private orderService: OrderService, private userService: UserService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.getAllSortedOrders(this.token);
      this.mapOrdersToDate(this.token);
    }
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  getAllSortedOrders(token: string): void {
    this.userService.getUserByToken(token).subscribe(user => {
      this.orderService.getAllSortedOrders(user.role).subscribe(response => {
        this.response = response;
      })
    })
  }

  selectProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  mapOrdersToDate(token: string): void {
    this.userService.getUserByToken(token).subscribe(user => {
      this.orderService.getAllSortedOrders(user.role).subscribe(response => {
        this.response.forEach((order: any) => {
          this.map[order.createdDate.substr(0, 10)] = (this.map[order.createdDate.substr(0, 10)] || 0) + 1;
        })
      })
    })
  }

  deleteOrder(id: number): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(user => {
        this.orderService.deleteOrder(id, user.role).subscribe(res => {
          this.toastrService.success("Order deleted successfully!", "Success", {
            timeOut: 3000,
            progressBar: true,
          })
          this.reloadComponent("/admin-panel/orders")

        }, error => {
          this.toastrService.error("Something went wrong!", "Error", {
            timeOut: 3000,
            progressBar: true,
          })
        })
      })
    } else {
      console.log("Access Denied!");
    }
  }
}
