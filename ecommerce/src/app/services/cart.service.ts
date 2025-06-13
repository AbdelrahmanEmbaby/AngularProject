import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICart, ICartItem } from '../interfaces/cart.interface';
import { IProductResponse } from '../interfaces/product.interface';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../configs/constants.config';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = API_URL;
  cart: ICart | null = null;
  cartItems: (ICartItem & { product: IProductResponse })[] = [];

  constructor(private http: HttpClient) {}

  async getCart(userId: number) {
    try {
      const carts = await lastValueFrom(
        this.http.get<ICart[]>(`${this.apiUrl}/carts?userId=${userId}`)
      );
      this.cart = carts[0];

      if (this.cart) {
        await this.loadProductsForCart();
      } else {
        this.cart = await this.createCart(userId);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  private async createCart(userId: number): Promise<ICart> {
    const newCart = {
      userId,
      date: new Date().toISOString(),
      items: [],
    };
    return lastValueFrom(
      this.http.post<ICart>(`${this.apiUrl}/carts`, newCart)
    );
  }

  private async loadProductsForCart() {
    try {
      const productRequests = this.cart!.items.map((item) =>
        lastValueFrom(
          this.http.get<IProductResponse>(
            `${this.apiUrl}/products/${item.productId}`
          )
        )
      );

      const products = await Promise.all(productRequests);
      this.cartItems = this.cart!.items.map((item, index) => ({
        ...item,
        product: products[index],
      }));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  async addToCart(cartItem: {
    productId: number;
    quantity: number;
    product?: IProductResponse;
  }) {
    if (!this.cart) {
      await this.getCart(1); // Assuming user ID 1 for demo
    }

    const product =
      cartItem.product ||
      this.cartItems.find((item) => item.product.id === cartItem.productId)
        ?.product;

    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = this.cart?.items.find(
      (item) => item.productId === cartItem.productId
    );
    const requestedQuantity = (existingItem?.quantity || 0) + cartItem.quantity;

    if (requestedQuantity > product.quantity) {
      throw new Error(
        `Only ${
          product.quantity - (existingItem?.quantity || 0)
        } more available`
      );
    }

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
    } else {
      this.cart?.items.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });

      if (cartItem.product) {
        this.cartItems.push({
          ...cartItem,
          product: cartItem.product,
        });
      }
    }

    await this.updateCartOnServer();
  }

  async increaseQuantity(productId: number, amount: number = 1) {
    const item = this.cart?.items.find((item) => item.productId === productId);
    const product = this.cartItems.find(
      (item) => item.product.id === productId
    )?.product;

    if (!item || !product) {
      throw new Error('Item not found in cart');
    }

    if (item.quantity + amount > product.quantity) {
      throw new Error(
        `Only ${product.quantity - item.quantity} more available`
      );
    }

    item.quantity += amount;
    await this.updateCartOnServer();
    this.updateLocalCartItems();
  }

  async decreaseQuantity(productId: number) {
    const item = this.cart?.items.find((item) => item.productId === productId);

    if (item) {
      item.quantity = Math.max(1, item.quantity - 1);
      await this.updateCartOnServer();
      this.updateLocalCartItems();
    }
  }

  async removeItem(productId: number) {
    if (this.cart) {
      this.cart.items = this.cart.items.filter(
        (item) => item.productId !== productId
      );
      await this.updateCartOnServer();
      this.updateLocalCartItems();
    }
  }

  private async updateCartOnServer() {
    if (this.cart) {
      this.cart = await lastValueFrom(
        this.http.put<ICart>(`${this.apiUrl}/carts/${this.cart.id}`, this.cart)
      );
    }
  }

  private updateLocalCartItems() {
    if (this.cart) {
      this.cartItems = this.cartItems
        .filter((cartItem) =>
          this.cart?.items.some(
            (item) => item.productId === cartItem.product.id
          )
        )
        .map((cartItem) => {
          const item = this.cart?.items.find(
            (i) => i.productId === cartItem.product.id
          );
          return {
            ...cartItem,
            quantity: item?.quantity || cartItem.quantity,
          };
        });

      const newItems = this.cart.items.filter(
        (item) => !this.cartItems.some((ci) => ci.product.id === item.productId)
      );

      if (newItems.length > 0) {
        this.loadProductsForNewItems(newItems);
      }
    }
  }

  private async loadProductsForNewItems(newItems: ICartItem[]) {
    try {
      const productRequests = newItems.map((item) =>
        lastValueFrom(
          this.http.get<IProductResponse>(
            `${this.apiUrl}/products/${item.productId}`
          )
        )
      );

      const products = await Promise.all(productRequests);
      this.cartItems = [
        ...this.cartItems,
        ...newItems.map((item, index) => ({
          ...item,
          product: products[index],
        })),
      ];
    } catch (error) {
      console.error('Error loading new products:', error);
    }
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (total, item) =>
        total +
        item.product.price *
          (1 - (item.product.discount || 0) / 100) *
          item.quantity,
      0
    );
  }
}
