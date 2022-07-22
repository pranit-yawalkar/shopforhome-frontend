import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  categories!: Category[];
  token!: string | null;
  loggedIn: boolean = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.token = localStorage.getItem('token');
    if(this.token!=null) {
      this.loggedIn = true;
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
