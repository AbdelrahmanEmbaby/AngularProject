import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { IOrder, IOrderItem } from '../../interfaces/order.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-orders.component.html',
})
export class UserOrdersComponent implements OnInit {
  orders: IOrder[] = [];
  isLoading = true;
  errorMessage = '';
  userId: number | null = null;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    this.userId = userData?.id ?? null;

    if (this.userId) {
      this.loadOrders();
    } else {
      this.errorMessage = 'User not logged in';
      this.isLoading = false;
    }
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.userId) {
      this.errorMessage = 'User ID not available';
      this.isLoading = false;
      return;
    }

    this.ordersService.getOrdersByUserId(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load orders';
        this.isLoading = false;
        console.error('Error loading orders:', err);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getOrderTotal(order: IOrder): number {
    return order.items.reduce((total, item) => {
      return total + this.getSubtotal(item);
    }, 0);
  }

  getSubtotal(item: IOrderItem): number {
    return item.price * (1 - (item.discount || 0) / 100) * item.quantity;
  }

  getProductName(item: IOrderItem): string {
    return item.product?.name || `Product #${item.productId}`;
  }

  getProductImage(item: IOrderItem): string | null {
    console.log(item.product);
    return item.product?.images?.[0] || null;
  }
}
