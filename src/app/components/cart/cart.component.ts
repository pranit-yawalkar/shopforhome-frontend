import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddToCart } from 'src/app/models/cart/add-to-cart';
import { Cart } from 'src/app/models/cart/cart';
import { Coupon } from 'src/app/models/order/coupon';
import { Product } from 'src/app/models/product/product';
import { CartService } from 'src/app/services/cart.service';
import { DiscountService } from 'src/app/services/discount.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  response!: any;
  discount!: string | null;
  discountAmount!: number;
  cart!: Cart;
  token!: string | null;
  addToCart!: AddToCart;
  coupons!: Coupon[];
  coupon!: Coupon;
  code!: string;


  @ViewChild('quantity') quantityInput: any;

  constructor(private cartService: CartService, private toastrService: ToastrService, private router: Router, private orderService: OrderService,
    private discountService: DiscountService, private userService: UserService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (localStorage.getItem('discount') != null) {
      this.discount = localStorage.getItem('discount')
      if (this.discount != null) {
        this.discountAmount = parseInt(this.discount);
      }
    }
    if (this.token != null) {
      this.getAllProducts(this.token);
      this.getAllCoupons(this.token);
    }
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  increase(cartItemId: number, productId: number, index: number) {
    if (this.response.cartItems[index].productDTO.quantity >= 1) {
      this.response.cartItems[index].quantity++;
      if (this.response.cartItems[index].quantity > this.response.cartItems[index].productDTO.quantity) {
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
    if (this.response.cartItems[index].productDTO.quantity > 0) {
      this.response.cartItems[index].quantity--;
      if (this.response.cartItems[index].quantity <= 1) {
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
    })
  }

  removeProduct(id: number): void {
    if (this.token != null) {
      this.cartService.removeProduct(this.token, id).subscribe(response => {
        this.toastrService.success("Product removed successfully!", "Success", {
          timeOut: 3000,
          progressBar: true
        })
        this.reloadComponent('/cart');
      }, error => {
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

  updateCart(cartItemId: number, productId: number, quantity: number) {
    if (this.token != null) {
      this.addToCart = new AddToCart();
      this.addToCart.productId = productId;
      this.addToCart.quantity = quantity;
      this.cartService.updateCart(this.token, cartItemId, this.addToCart).subscribe(response => {
        this.response = response;
      }, error => {
        console.log(error);
      });
    }
  }

  orderNow(cart: Cart): void {
    if (this.token != null) {
      this.orderService.placeOrder(this.token, cart).subscribe(response => {
        localStorage.removeItem('discount');
        this.reloadComponent('/thanks');
      }, error => {
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

  getAllCoupons(token: string): void {
    this.userService.getUserByToken(token).subscribe(user => {
      this.discountService.getAllCoupons(user.role).subscribe(coupons => {
        this.coupons = coupons;
      });
    })
  }

  onSubmit() {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.applyCoupon(this.token, this.code);
    } else {
      console.log("Access Denied!");
    }
  }

  applyCoupon(token: string, code: string): void {
    this.discountService.getCouponByCode(code).subscribe(coupon => {
      this.discountService.applyCoupon(token, coupon).subscribe(res => {
        this.cart = res;
        localStorage.setItem('discount', this.cart.discount.toString());
        this.toastrService.success("Coupon applied successfully!", "Success", {
          timeOut: 3000,
          progressBar: true
        })
        this.reloadComponent('/cart');
      })
    }, error => {
      this.toastrService.error("Something went wrong!", "Error", {
        timeOut: 3000,
        progressBar: true
      })
    })
  }
}
