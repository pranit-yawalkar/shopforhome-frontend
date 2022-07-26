import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Coupon } from 'src/app/models/order/coupon';
import { DiscountService } from 'src/app/services/discount.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.css']
})
export class AdminDiscountComponent implements OnInit {
  coupons!: Coupon[];
  couponForm!: FormGroup;
  coupon!: Coupon;
  token!: string | null;

  constructor(private discountService: DiscountService, private userService: UserService, private formBuilder: FormBuilder, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.getAllCoupons(this.token);
    }
    this.couponForm = this.formBuilder.group({
      code: ['', Validators.required],
      percentage: ['', Validators.required]
    })
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  getAllCoupons(token: string): void {
    this.userService.getUserByToken(token).subscribe(user => {
      this.discountService.getAllCoupons(user.role).subscribe(coupons => {
        this.coupons = coupons;
      })
    })
  }

  onClickAddButton(): void {
    this.couponForm.reset();
  }

  onClickUpdateButton(id: number): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(response => {
        this.discountService.getCouponById(id, response.role).subscribe(response => {
          this.coupon = response;
          this.couponForm.patchValue({
            code: this.coupon.code,
            percentage: this.coupon.percentage
          })
        }, error => {
          console.log(error)
        });
      })
    } else {
      console.log("Access Denied!");
    }
  }

  addCoupon(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(response => {
        if (this.couponForm.valid) {
          this.discountService.addCoupon(response.role, this.couponForm.value).subscribe(response => {
            this.toastrService.success("Coupon added successfully!", "Success", {
              timeOut: 3000,
              progressBar: true,
            })
            this.reloadComponent("/admin-panel/coupons");
          }, error => {
            this.toastrService.error("Something went wrong!", "Error", {
              timeOut: 3000,
              progressBar: true,
            })
          })
        }
      })
    } else {
      console.log("Access Denied!");
    }
  }

  updateCoupon(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(response => {
        this.discountService.updateCoupon(this.coupon.id, response.role, this.couponForm.value).subscribe(response => {
          this.toastrService.success("coupon updated successfully!", "Success", {
            timeOut: 3000,
            progressBar: true,
          })
          this.reloadComponent("/admin-panel/coupons")

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

  deleteCoupon(id: number): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.userService.getUserByToken(this.token).subscribe(response => {
        this.discountService.deleteCoupon(id, response.role).subscribe(response => {
          this.toastrService.success("Coupon deleted successfully!", "Success", {
            timeOut: 3000,
            progressBar: true,
          })
          this.reloadComponent("/admin-panel/coupons")
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
