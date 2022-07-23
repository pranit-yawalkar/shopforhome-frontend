import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Addtowishlist } from 'src/app/models/wishlist/addtowishlist';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AddToCart } from 'src/app/models/cart/add-to-cart';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  id!: number;
  products!: Product[];
  category!: Category;
  product!: Product;
  response!: any;
  token!: string | null;
  loggedIn: boolean = false;
  addToWishlist!: Addtowishlist;
  addToCart!: AddToCart;

  constructor(private categoryService: CategoryService, private productService: ProductService, private router: Router, private route: ActivatedRoute, private wishlistService: WishlistService, private toastrService: ToastrService, private cartService: CartService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getProductByCategory(this.id);
    this.getCategoryById(this.id);
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.loggedIn = true;
    }
  }

  getProductByCategory(id:number) {
    return this.productService.getProductByCategoryId(id).subscribe(products => {
      console.log(products);
      this.products = products;
    })
  }

  getCategoryById(id: number) {
    return this.categoryService.getCategoryById(id).subscribe(category => {
      this.category = category;
    })
  }

  selectProduct(id: number): void {
    this.router.navigate(['/product', id]);
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
    }
  }
  
  addProductToCart(id: number) {
    if (this.token != null) {
      this.addToCart = new AddToCart();
      this.addToCart.productId = id;
      this.addToCart.quantity = 1;
      this.cartService.addProduct(this.token, this.addToCart).subscribe(response => {
        this.response = response;
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
