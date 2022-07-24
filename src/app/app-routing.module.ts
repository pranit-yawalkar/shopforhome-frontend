import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminCategoryComponent } from './components/admin-panel/admin-category/admin-category.component';
import { AdminDiscountComponent } from './components/admin-panel/admin-discount/admin-discount.component';
import { AdminHomeComponent } from './components/admin-panel/admin-home/admin-home.component';
import { AdminOrdersComponent } from './components/admin-panel/admin-orders/admin-orders.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminProductComponent } from './components/admin-panel/admin-product/admin-product.component';
import { AdminUserComponent } from './components/admin-panel/admin-user/admin-user.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoryComponent } from './components/category/category.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductComponent } from './components/product/product.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ThanksComponent } from './components/thanks/thanks.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '', component: HeaderComponent, outlet: 'navbar'},
  {path: '', component: FooterComponent, outlet: 'footer'},
  {path: 'home', redirectTo: '', pathMatch: 'full', },
  {path: 'category/:id', component: CategoryComponent},
  {path: 'product/:id', component: ProductComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'cart', component: CartComponent},
  {path: 'thanks', component: ThanksComponent},
  {path: 'admin-panel', component: AdminPanelComponent, children: [
    {path: '', component: AdminHomeComponent},
    {path: 'categories', component: AdminCategoryComponent},
    {path: 'products', component: AdminProductComponent},
    {path: 'users', component: AdminUserComponent},
    {path: 'orders', component: AdminOrdersComponent},
    {path: 'coupons', component: AdminDiscountComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
