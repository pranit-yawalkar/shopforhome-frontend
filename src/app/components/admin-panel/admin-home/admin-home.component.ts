import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Chart, registerables } from "chart.js";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  token!: string | null;
  response!: any;
  map: any = {};
  labels!: any[];
  values!: any[];

  chart: any = [];


  constructor(private userService: UserService, private orderService: OrderService) { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(user => {
        this.orderService.getAllSortedOrdersAsc(user.role).subscribe(response => {
          this.response = response;
          this.response.forEach((order: any)=>{
            this.map[order.createdDate.substr(0,10)] = (this.map[order.createdDate.substr(0,10)] || 0) + 1;
          })
          this.labels = Object.keys(this.map);
          this.values = Object.values(this.map);

          console.log(this.labels, this.values);
          
          this.chart = new Chart('canvas', {
            type: 'line',
            data: {
              labels: this.labels,
              datasets: [
                {
                  label: 'Orders this week',
                  data: this.values,
                  borderWidth: 3,
                  backgroundColor: 'rgba(93, 175, 89, 0.1)',
                  borderColor: '#3e95cd'
                }
              ]
            }
          });
        })
      })
    }
  }

  mapOrdersToDate(token: string): void {
    
  }

}
