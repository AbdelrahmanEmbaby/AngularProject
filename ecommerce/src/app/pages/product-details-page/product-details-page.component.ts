import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { IProductResponse } from '../../interfaces/product.interface';
import { ImageSliderComponent } from '../../components/image-slider/image-slider.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'ec-product-details',
  standalone: true,
  imports: [CommonModule, ImageSliderComponent, RouterModule],
  templateUrl: './product-details-page.component.html',
})
export class ProductDetailsPageComponent {
  @ViewChild('deleteDialog') deleteDialog!: ElementRef<HTMLDialogElement>;
  product: IProductResponse | null = null;
  loading = true;
  currentImageIndex = 0;
  quantity = 1;
  addingToCart = false;
  isAdmin = false;
  routeEnum = RouteEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.getProductById(productId).subscribe({
        next: (product: IProductResponse | null) => {
          this.product = product;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  changeImage(index: number) {
    this.currentImageIndex = index;
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price * (1 - discount / 100);
  }

  increaseQuantity() {
    const maxAvailable = this.getMaxAvailableQuantity();
    if (this.product && this.quantity < maxAvailable) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getMaxAvailableQuantity(): number {
    if (!this.product) return 0;

    const existingItem = this.cartService.cartItems.find(
      (item) => item.product.id === this.product?.id
    );

    return this.product.quantity - (existingItem?.quantity || 0);
  }

  async addToCart() {
    if (!this.product || this.product.quantity <= 0) return;

    const maxAvailable = this.getMaxAvailableQuantity();
    if (this.quantity > maxAvailable) {
      return;
    }

    this.addingToCart = true;
    try {
      const existingItem = this.cartService.cartItems.find(
        (item) => item.product.id === this.product?.id
      );

      if (existingItem) {
        await this.cartService.increaseQuantity(this.product.id, this.quantity);
      } else {
        await this.cartService.addToCart({
          productId: this.product.id,
          quantity: this.quantity,
          product: this.product,
        });
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
    } finally {
      this.addingToCart = false;
    }
  }

  openDeleteDialog() {
    this.deleteDialog.nativeElement.showModal();
  }

  closeDeleteDialog() {
    this.deleteDialog.nativeElement.close();
  }

  async confirmDelete() {
    if (!this.product) return;

    try {
      await lastValueFrom(this.productsService.deleteProduct(this.product.id));
      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      this.closeDeleteDialog();
    }
  }
}
