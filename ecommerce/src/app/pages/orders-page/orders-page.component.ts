import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/order.service';
import { IOrder } from '../../interfaces/order.interface';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'ec-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-page.component.html',
})
export class OrdersPageComponent implements OnInit {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  statusFilter: string = 'all';
  isLoading = true;
  isAdmin = false;
  routeEnum = RouteEnum;

  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      },
    });
  }

  filterOrders() {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        (order) => order.status === this.statusFilter
      );
    }
  }

  onStatusChange(orderId: number, newStatus: string) {
    this.ordersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex((o) => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.filterOrders();
        }
      },
      error: (err) => console.error('Error updating order status:', err),
    });
  }

  getTotal(order: IOrder): number {
    return order.items.reduce((total, item) => {
      return total + item.price * (1 - item.discount / 100) * item.quantity;
    }, 0);
  }

  resetFilters() {
    this.statusFilter = 'all';
    this.filterOrders();
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/', RouteEnum.Order, orderId]);
  }

  getTotalQuantity(order: IOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}
