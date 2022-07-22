import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddToCart } from 'src/app/models/cart/add-to-cart';
import { Cart } from 'src/app/models/cart/cart';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  response!: any;
  cart!: Cart;
  token!: string | null;
  addToCart!: AddToCart;
  @ViewChild('quantity') quantityInput: any;

  constructor(private cartService: CartService, private toastrService: ToastrService, private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if(this.token != null) {
      this.getAllProducts(this.token);
    }
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  increase(cartItemId: number, productId: number, index: number) {
    if(this.response.cartItems[index].productDTO.quantity >= 1) {
      this.response.cartItems[index].quantity++;
      if(this.response.cartItems[index].quantity > this.response.cartItems[index].productDTO.quantity) {
        this.response.cartItems[index].quantity = this.response.cartItems[index].productDTO.quantity;

        this.updateCart(cartItemId, productId, this.response.cartItems[index].quantity);
        this.reloadComponent('/cart');
      } else {
        this.updateCart(cartItemId, productId, this.response.cartItems[index].quantity);
        this.reloadComponent('/cart');
      }
    } else {
      this.reloadComponent('/cart');
      return;
    }
  }

  decrease(cartItemId: number, productId: number, index: number) {
    if(this.response.cartItems[index].productDTO.quantity > 0) {
      this.response.cartItems[index].quantity--;
      
      if(this.response.cartItems[index].quantity <= 1) {
        this.response.cartItems[index].quantity = 1;
        this.updateCart(cartItemId, productId, this.response.cartItems[index].quantity);
        this.reloadComponent('/cart'); 
      } else {
        this.updateCart(cartItemId, productId, this.response.cartItems[index].quantity);
        this.reloadComponent('/cart');
      }
    } else {
      this.reloadComponent('/cart');
      return;
    }
  }

  selectProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  getAllProducts(token: string): void {
    this.cartService.getAllProducts(token).subscribe(cart => {
      this.response = cart;
      console.log(cart);
    })
  }

  removeProduct(id: number): void {
    if(this.token!=null) {
      this.cartService.removeProduct(this.token, id).subscribe(response=>{
        this.toastrService.success("Product removed successfully!", "Success", {
          timeOut: 3000,
          progressBar: true
        })
        this.reloadComponent('/cart');
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

  updateCart(cartItemId: number, productId: number, quantity: number) {
    if(this.token!=null) {
      this.addToCart = new AddToCart();
      this.addToCart.productId = productId;
      this.addToCart.quantity = quantity;
      this.cartService.updateCart(this.token, cartItemId, this.addToCart).subscribe(response=> {
        console.log(response);
      }, error=> {
        console.log(error);
      });
    }
  }

  orderNow(cart: Cart): void {
    if(this.token!=null) {
      // this.cart = new Cart();
      // this.cart.cartItems = cartItems.
      this.orderService.placeOrder(this.token, cart).subscribe(response=> {
        console.log(response);
        this.reloadComponent('/thanks');
      }, error=> {
        console.log(error);
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true
        })
      })
    } else {
      this.toastrService.error("Something went wrong!", "Error", {
        timeOut: 3000,
        progressBar: true
      })
    }
  }

}
