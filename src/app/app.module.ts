import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { ToastrModule } from 'ngx-toastr';
import { ThanksComponent } from './components/thanks/thanks.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminHomeComponent } from './components/admin-panel/admin-home/admin-home.component';
import { AdminCategoryComponent } from './components/admin-panel/admin-category/admin-category.component';
import { AdminUserComponent } from './components/admin-panel/admin-user/admin-user.component';
import { AdminProductComponent } from './components/admin-panel/admin-product/admin-product.component';
import { AdminOrdersComponent } from './components/admin-panel/admin-orders/admin-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CategoryComponent,
    ProductComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    OrdersComponent,
    WishlistComponent,
    CartComponent,
    ThanksComponent,
    AdminPanelComponent,
    AdminHomeComponent,
    AdminCategoryComponent,
    AdminUserComponent,
    AdminProductComponent,
    AdminOrdersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
