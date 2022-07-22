import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  categories!: Category[];
  response!: any;
  loggedIn: boolean = false;
  flag!: boolean;
  cartLength!: number;
  token!: string | null;

  constructor(private categoryService: CategoryService, private userService: UserService, private toastrService: ToastrService, private router: Router,
    private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.token = localStorage.getItem('token');
    if(this.token!=null) {
      this.loggedIn = true;
      this.cartLength = this.getCartItemCount(this.token);
    }
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    },
      error => {
        console.log(error);
    })
  }

  doSignOut(): void {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.toastrService.success("", "Logged out successfully!", {
      timeOut: 2000,
      progressBar: true
    });
    this.reloadComponent('/login');
    // this.router.navigate(['/login']);
    // setTimeout(() => {
    //     window.location.reload();
    // }, 2500);
  }

  getCartItemCount(token: string): number {
    this.cartService.getAllProducts(token).subscribe(response => {
      this.response = response;
      this.cartLength = this.response.cartItems.length;
      return this.response.cartItems.length;
    });
    return 0;
  }

}
