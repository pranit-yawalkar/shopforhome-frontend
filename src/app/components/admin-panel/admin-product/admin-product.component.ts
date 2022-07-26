import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { single } from 'rxjs';
import { Category } from 'src/app/models/product/category';
import { Product } from 'src/app/models/product/product';
import { Productandcat } from 'src/app/models/product/productandcat';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  productForm!: FormGroup;
  product!: Product;
  productCat!: Productandcat;
  productCats: Productandcat[] = [];
  products!: Product[];
  category!: Category;
  categories!: Category[];


  constructor(private productService: ProductService,
    private categoryService: CategoryService, private formBuilder: FormBuilder,
    private toastrService: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      categoryName: ['', Validators.required]
    })
  }

  reloadComponent(path: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([path]);
  }

  onClickAddButton(): void {
    this.productForm.reset();
  }

  onClickUpdateButton(id: number): void {
    this.productService.getProductById(id).subscribe(response => {
      this.product = response;
      this.categoryService.getCategoryById(this.product.categoryId).subscribe(category => {
        this.category = category;
        this.productForm.patchValue({
          productName: this.product.productName,
          imageUrl: this.product.imageUrl,
          price: this.product.price,
          description: this.product.description,
          quantity: this.product.quantity,
          categoryName: category.categoryName
        })
      })
    }, error => {
      console.log(error);
    });
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      products.forEach(prod => {

        this.categoryService.getCategoryById(prod.categoryId).subscribe(category => {
          this.productCat = new Productandcat();
          this.productCat.productId = prod.productId,
            this.productCat.productName = prod.productName,
            this.productCat.imageUrl = prod.imageUrl,
            this.productCat.description = prod.description,
            this.productCat.price = prod.price,
            this.productCat.quantity = prod.quantity,
            this.productCat.categoryName = category.categoryName;
          this.productCats.push(this.productCat);
        })
      })
    })
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  addProduct(): void {
    this.productCat = this.productForm.value;
    this.categoryService.getCategoryByName(this.productCat.categoryName).subscribe(category => {
      this.product = new Product();
      this.product.productName = this.productCat.productName;
      this.product.imageUrl = this.productCat.imageUrl;
      this.product.price = this.productCat.price;
      this.product.description = this.productCat.description;
      this.product.quantity = this.productCat.quantity;
      this.product.categoryId = category.id;
      this.productService.createProduct(this.product).subscribe(response => {
        this.toastrService.success("Category added successfully!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        this.reloadComponent("/admin-panel/products");
      }, error => {
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true,
        })
        console.log(error);
      })
    })
  }

  updateProduct(): void {
    this.productCat = this.productForm.value;
    this.categoryService.getCategoryByName(this.productCat.categoryName).subscribe(category => {
      this.product.productName = this.productCat.productName;
      this.product.imageUrl = this.productCat.imageUrl;
      this.product.price = this.productCat.price;
      this.product.description = this.productCat.description;
      this.product.quantity = this.productCat.quantity;
      this.product.categoryId = category.id;
      this.productService.updateProduct(this.product, this.product.productId).subscribe(response => {
        this.toastrService.success("Category updated successfully!", "Success", {
          timeOut: 3000,
          progressBar: true,
        })
        this.reloadComponent("/admin-panel/products")
      }, error => {
        this.toastrService.error("Something went wrong!", "Error", {
          timeOut: 3000,
          progressBar: true,
        })
      })
    })
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(response => {
      this.toastrService.success("Product deleted successfully!", "Success", {
        timeOut: 3000,
        progressBar: true,
      })
      this.reloadComponent("/admin-panel/products")
    }, error => {
      this.toastrService.error("Something went wrong!", "Error", {
        timeOut: 3000,
        progressBar: true,
      })
    })
  }
}
