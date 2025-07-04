// Angular
import { Routes } from '@angular/router';
// Enums
import { RouteProtection } from './enums/route-protection.enum';
// Layout
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
// Pages
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { EditProductPageComponent } from './pages/edit-product-page/edit-product-page.component';
import { CreateProductPageComponent } from './pages/create-product-page/create-product-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { OrderDetailsPageComponent } from './pages/order-details-page/order-details-page.component';
import { UserOrdersComponent } from './pages/user-orders/user-orders.component';
import { ProfileComponent } from './pages/profile-page/profile-page.component';
// enums
import { RouteEnum } from './enums/route.enum';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: { protection: RouteProtection.Neutral },
    children: [
      {
        path: RouteEnum.Home,
        component: HomePageComponent,
        data: { protection: RouteProtection.Neutral },
      },
      {
        path: RouteEnum.Products,
        component: ProductsPageComponent,
        data: { protection: RouteProtection.Protected },
      },
      {
        path: RouteEnum.Product + '/:id',
        component: ProductDetailsPageComponent,
        data: { protection: RouteProtection.Protected },
      },
      {
        path: RouteEnum.Product + '/' + RouteEnum.ProductCreate + '/:id',
        component: CreateProductPageComponent,
        data: { protection: RouteProtection.AdminOnly },
      },
      {
        path: RouteEnum.Product + '/' + RouteEnum.ProductEdit + '/:id',
        component: EditProductPageComponent,
        data: { protection: RouteProtection.AdminOnly },
      },
      {
        path: RouteEnum.Orders,
        component: OrdersPageComponent,
        data: { protection: RouteProtection.AdminOnly },
      },
      {
        path: RouteEnum.Order + '/:id',
        component: OrderDetailsPageComponent,
        data: { protection: RouteProtection.AdminOnly },
      },
      {
        path: RouteEnum.Cart,
        component: CartPageComponent,
        data: { protection: RouteProtection.Protected },
      },
      {
        path: RouteEnum.Me + '/' + RouteEnum.Orders,
        component: UserOrdersComponent,
        data: { protection: RouteProtection.Protected },
      },
      {
        path: RouteEnum.Me + '/' + RouteEnum.Profile,
        component: ProfileComponent,
        data: { protection: RouteProtection.Protected },
      },
      {
        path: RouteEnum.Register,
        component: RegisterPageComponent,
        data: { protection: RouteProtection.GuestOnly },
      },
      {
        path: RouteEnum.Login,
        component: LoginPageComponent,
        data: { protection: RouteProtection.GuestOnly },
      },
      {
        path: RouteEnum.About,
        component: AboutPageComponent,
        data: { protection: RouteProtection.Neutral },
      },
    ],
  },
  // {
  //   path: RouteEnum.Error,
  //   redirectTo: '',
  //   data: { protection: RouteProtection.Neutral },
  // },
];
