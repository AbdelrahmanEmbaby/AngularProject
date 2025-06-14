import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/order.service';
import { IOrder, IOrderItem } from '../../interfaces/order.interface';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'ec-order-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details-page.component.html',
})
export class OrderDetailsPageComponent implements OnInit {
  routeEnum = RouteEnum;
  order: IOrder | null = null;
  isLoading = true;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(orderId: string) {
    this.isLoading = true;
    this.ordersService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.isLoading = false;
        this.router.navigate(['/admin/orders']);
      },
    });
  }

  getTotal(order: IOrder): number {
    return order.items.reduce((total, item) => {
      return total + item.price * (1 - item.discount / 100) * item.quantity;
    }, 0);
  }

  getSubtotal(item: IOrderItem): number {
    return item.price * (1 - item.discount / 100) * item.quantity;
  }

  updateStatus(newStatus: string) {
    if (!this.order) return;

    const currentItems = this.order.items;

    this.ordersService.updateOrderStatus(this.order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        this.order = {
          ...updatedOrder,
          items: currentItems,
        };
      },
      error: (err) => console.error('Error updating order status:', err),
    });
  }

  backToOrders() {
    this.router.navigate([this.routeEnum.Orders]);
  }
}
