import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { IProduct, IUpdateProduct } from '../../interfaces/product.interface';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'ec-edit-product-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './edit-product-page.component.html',
})
export class EditProductPageComponent implements OnInit {
  routeEnum = RouteEnum;
  product: IProduct = {
    name: '',
    description: '',
    price: 0,
    discount: 0,
    quantity: 0,
    images: [],
    isDeleted: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.getProductById(productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: () => {
          this.router.navigate(['/products']);
        },
      });
    }
  }

  handleSubmit(updatedProduct: IUpdateProduct) {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.updateProduct(+productId, updatedProduct).subscribe({
        next: () => {
          this.router.navigate([this.routeEnum.Product, productId]);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        },
      });
    }
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
