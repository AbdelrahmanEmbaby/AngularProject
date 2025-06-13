import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit {
  routeEnum = RouteEnum;

  constructor(public cartService: CartService, private router: Router) {}

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
}
