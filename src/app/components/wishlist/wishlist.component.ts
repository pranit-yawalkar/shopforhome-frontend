import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Addtowishlist } from 'src/app/models/wishlist/addtowishlist';
import { Product } from 'src/app/models/product';
import { WishlistItem } from 'src/app/models/wishlist/wishlist-item';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  responseList!: any[];
  token!: string | null;
  response!: any;
  addToWishlist!: Addtowishlist;

  constructor(private wishlistService: WishlistService,
    private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.getAllProducts(this.token);
    }
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['wishlist']);
  }

  getAllProducts(token: string): void {
    this.wishlistService.getAllProducts(token).subscribe(wishlistItems => {
      console.log(wishlistItems);
      this.responseList = wishlistItems;
    })
  }

  selectProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  addProduct(id: number): void {
    if(this.token!=null) {
      this.addToWishlist.productId = id;
      this.wishlistService.addProduct(this.token, this.addToWishlist).subscribe(response => {
        this.response = response;
        console.log(this.response);
      }, error => {
        console.log(error);
      })
    }
  }

  removeProduct(id: number): void {
    if (this.token != null) {
      this.wishlistService.removeProduct(this.token, id).subscribe(response => {
        this.response = response;
        this.toastrService.success("Product removed successfully!", "Success", {
          timeOut: 3000,
          progressBar: true
        })
        this.reloadComponent();
        console.log(this.response);
      }, error => {
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true
        })
        console.log(error);
      })
    } else {
      this.toastrService.error("Something went wrong!", "Error", {
        timeOut: 3000,
        progressBar: true
      })
      console.log("Something went wrong..");
    }
  }
}
