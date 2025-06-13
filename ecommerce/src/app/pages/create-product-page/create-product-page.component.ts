import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../interfaces/product.interface';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'ec-create-product-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './create-product-page.component.html',
})
export class CreateProductPageComponent {
  routeEnum = RouteEnum;
  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  handleSubmit(product: IProduct) {
    this.productsService.createProduct(product).subscribe({
      next: () => this.router.navigate([this.routeEnum.Products]),
      error: (err) => console.error('Error creating product:', err),
    });
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
