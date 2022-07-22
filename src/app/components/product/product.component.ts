import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddToCart } from 'src/app/models/cart/add-to-cart';
import { Product } from 'src/app/models/product';
import { Addtowishlist } from 'src/app/models/wishlist/addtowishlist';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product!: Product;
  id!: number;
  loggedIn: boolean = false;
  token!: string | null;
  response!: any;
  addToWishlist!: Addtowishlist;
  addToCart!: AddToCart;
  @ViewChild('quantity') quantityInput: any;

  constructor(private productService: ProductService, private route: ActivatedRoute, private wishlistService: WishlistService, private toastrService: ToastrService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getProductById(this.id);
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.loggedIn = true;
      console.log(this.loggedIn);
    }
  }

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe(product => { 
      this.product = product;
    })
  }

  reloadComponent(id: number) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/product', id]);
  }

  addProductToWishlist(id: number): void {
    if (this.token != null) {
      this.addToWishlist = new Addtowishlist();
      this.addToWishlist.productId = id;
      this.wishlistService.addProduct(this.token, this.addToWishlist).subscribe(response => {
        this.response = response;
        this.toastrService.success("Product added to wishlist!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        console.log(this.response);
      }, error => {
        this.toastrService.error("Product already exists in wishlist", "Go to wishlist", {
          timeOut: 3000,
          progressBar: true
        })
        console.log(error);
      })
    } else {
      this.toastrService.error("Please login to add", "Error", {
        timeOut: 3000,
        progressBar: true
      })
      console.log("Please login to add");
    }
  }

  addProductToCart(id: number) {
    if (this.token != null) {
      this.addToCart = new AddToCart();
      this.addToCart.productId = id;
      this.addToCart.quantity = 1;
      this.cartService.addProduct(this.token, this.addToCart).subscribe(response => {
        this.response = response;
        this.reloadComponent(id);
        this.toastrService.success("Product added to cart!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        console.log(this.response);
      }, error => {
        this.toastrService.error("Product already exists in cart", "Go to cart", {
          timeOut: 3000,
          progressBar: true
        })
        console.log(error);
      })
    } else {
      this.toastrService.error("Please login to add", "Error", {
        timeOut: 3000,
        progressBar: true
      })
      console.log("Please login to add");
    }
  }
}
