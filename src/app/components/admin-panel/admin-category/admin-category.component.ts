import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/product/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  id!: number;
  categories!: Category[];
  category!: Category;
  addCategoryForm!: FormGroup;
  token!: string | null;

  constructor(private categoryService: CategoryService, private toastrService: ToastrService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.addCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required]
    })
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  getAllCategories(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.categoryService.getAllCategories().subscribe(categories => {
        this.categories = categories;
      },
        error => {
          console.log(error);
        })
    } else {
      console.log("Access Denied!");
    }
  }

  onClickAddButton(): void {
    this.addCategoryForm.reset();
  }

  onClickUpdateButton(id: number): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.categoryService.getCategoryById(id).subscribe(response => {
        this.category = response;
        this.addCategoryForm.patchValue({
          categoryName: this.category.categoryName,
          imageUrl: this.category.imageUrl,
          description: this.category.description
        })
      }, error => {
        console.log(error)
      });
    } else {
      console.log("Access Denied!");
    }
  }

  addCategory(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.categoryService.addCategory(this.addCategoryForm.value).subscribe(response => {
        this.toastrService.success("Category added successfully!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        this.reloadComponent("/admin-panel/categories")
      }, error => {
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true,
        })
      })
    } else {
      console.log("Access Denied!");
    }

  }

  updateCategory(): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.categoryService.updateCategory(this.addCategoryForm.value, this.category.id).subscribe(response => {
        this.toastrService.success("Category updated successfully!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        this.reloadComponent("/admin-panel/categories");
      }, error => {
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true,
        })
      })
    } else {
      console.log("Access Denied!");
    }
  }

  deleteCategory(id: number): void {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.categoryService.deleteCategory(id).subscribe(response => {
        this.toastrService.success("Category deleted successfully!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        this.reloadComponent("/admin-panel/categories")
      }, error => {
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true,
        })
      })
    } else {
      console.log("Access Denied!");
    }
  }

}
