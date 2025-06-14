import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouteEnum } from '../../enums/route.enum';
import { OrdersService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit {
  routeEnum = RouteEnum;

  constructor(
    public cartService: CartService,
    private router: Router,
    private orderService: OrdersService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const userId = 1;
    await this.cartService.getCart(userId);
  }

  increase(productId: number) {
    this.cartService.increaseQuantity(productId);
  }

  decrease(productId: number) {
    this.cartService.decreaseQuantity(productId);
  }

  remove(productId: number) {
    this.cartService.removeItem(productId);
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  checkout(){
    const userId = this.authService.getUserData()?.id;
    if (userId) {
      this.orderService.placeOrder(userId);
      
    }
  }
}
