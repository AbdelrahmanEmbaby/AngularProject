import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  forkJoin,
  lastValueFrom,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IOrder, IOrderItem } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';
import { API_URL_TOKEN } from '../configs/tokens.config';
import { ICart, ICartItem } from '../interfaces/cart.interface';
import { ProductsService } from './products.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    @Inject(API_URL_TOKEN) private readonly apiUrl: string,
    private http: HttpClient,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  getOrders(status?: string): Observable<IOrder[]> {
    let url = `${this.apiUrl}/orders`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<IOrder[]>(url);
  }

  getOrderById(orderId: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/orders/${orderId}`).pipe(
      switchMap((order) => {
        const productRequests = order.items.map((item) =>
          this.getProductDetails(item.productId).pipe(
            map((product) => ({
              ...item,
              product: product,
            }))
          )
        );

        return forkJoin(productRequests).pipe(
          map((items) => ({
            ...order,
            items: items,
          }))
        );
      })
    );
  }

  getOrdersByUserId(userId: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/orders?userId=${userId}`).pipe(
      switchMap((orders) => {
        if (!orders || orders.length === 0) {
          return of([]);
        }
  
        const orderRequests = orders.map(order => {
          const productRequests = order.items.map(item =>
            this.getProductDetails(item.productId).pipe(
              map(product => ({
                ...item,
                product: product,
              }))
            )
          );
  
          return forkJoin(productRequests).pipe(
            map(items => ({
              ...order,
              items: items,
            }))
          );
        });
  
        return forkJoin(orderRequests);
      })
    );
  }

  updateOrderStatus(id: number, status: string): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.apiUrl}/orders/${id}`, { status });
  }

  private getProductDetails(productId: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/products/${productId}`);
  }

  async placeOrder(userId: number): Promise<IOrder> {
    try {
      await this.cartService.getCart(userId);

      if (!this.cartService.cart || this.cartService.cartItems.length === 0) {
        throw new Error('Cannot place order: Cart is empty');
      }

      const outOfStockItems = this.cartService.cartItems.filter(
        (cartItem) => cartItem.quantity > cartItem.product.quantity
      );

      if (outOfStockItems.length > 0) {
        const productNames = outOfStockItems
          .map((item) => item.product.name)
          .join(', ');
        throw new Error(`Insufficient stock for: ${productNames}`);
      }

      const orderItems: IOrderItem[] = this.cartService.cartItems.map(
        (item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          discount: item.product.discount || 0,
        })
      );

      const newOrder: Omit<IOrder, 'id'> = {
        userId,
        items: orderItems,
        status: 'pending',
        isDeleted: false,
      };

      await this.updateProductQuantities();

      const createdOrder = await lastValueFrom(
        this.http.post<IOrder>(`${this.apiUrl}/orders`, newOrder).pipe(
          catchError((error) => {
            console.error('Order creation failed:', error);
            return throwError(() => new Error('Failed to create order'));
          })
        )
      );

      await lastValueFrom(
        this.cartService.clearCart(this.cartService.cart!.id)
      );

      this.cartService.cart = null;
      this.cartService.cartItems = [];

      return createdOrder;
    } catch (error) {
      console.error('Order placement failed:', error);
      throw error;
    }
  }

  private async updateProductQuantities(): Promise<void> {
    const updatePromises = this.cartService.cartItems.map(async (cartItem) => {
      const newQuantity = cartItem.product.quantity - cartItem.quantity;
      return lastValueFrom(
        this.productsService.updateProduct(cartItem.product.id, {
          quantity: newQuantity,
        })
      );
    });

    await Promise.all(updatePromises);
  }
}
