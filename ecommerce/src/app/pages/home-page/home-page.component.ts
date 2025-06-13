// home-page.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { IProductResponse } from '../../interfaces/product.interface';
import { ItemsListComponent } from '../../components/items-list/items-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ec-home-page',
  standalone: true,
  imports: [CommonModule, ItemsListComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  featuredProducts$: Observable<IProductResponse[]>;

  constructor(private productsService: ProductsService) {
    this.featuredProducts$ = this.getFeaturedProducts();
  }

  private getFeaturedProducts(): Observable<IProductResponse[]> {
    return this.productsService.getProducts('', 1);
  }
}
