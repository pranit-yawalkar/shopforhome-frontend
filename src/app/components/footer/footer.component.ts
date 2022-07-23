import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  categories!: Category[];
  token!: string | null;
  loggedIn: boolean = false;
  role!: string | null;

  constructor(private categoryService: CategoryService, private userService: UserService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.token = localStorage.getItem('token');
    if(this.token!=null) {
      this.loggedIn = true;
      // this.role = localStorage.getItem('role');
      this.userService.getUserByToken(this.token).subscribe(user=> {
        this.role = user.role;
      })
    }
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    },
      error => {
        console.log(error);
    })
  }

}
