import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { User } from 'src/app/models/user/user';
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
  role!: string | null;
  searchValue!: string | null;

  constructor(private categoryService: CategoryService, private userService: UserService, private toastrService: ToastrService, private router: Router,
    private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.token = localStorage.getItem('token');
    if(this.token!=null) {
      this.loggedIn = true;
      // this.role = localStorage.getItem('role');
      this.userService.getUserByToken(this.token).subscribe(user=> {
        this.role = user.role;
      })
      this.cartLength = this.getCartItemCount(this.token);
    }

    if(this.route.snapshot.paramMap.get('search')!=null) {
      this.searchValue = this.route.snapshot.paramMap.get('search');
    }
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  reloadOnSearch(path: string, queryParams: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path], queryParams);
  }

  selectCategory(id: number) {
    this.reloadComponent(`/category/${id}`);
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      console.log(this.categories);
    },
      error => {
        console.log(error);
    })
  }

  search(): void {
    if(this.searchValue!=null) {
      console.log(this.searchValue);
      this.reloadOnSearch('', {queryParams: {search: this.searchValue}});
    }
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
