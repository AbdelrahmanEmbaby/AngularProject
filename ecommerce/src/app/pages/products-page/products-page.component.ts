import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { ProductsService } from '../../services/products.service';
import { IProductResponse } from '../../interfaces/product.interface';
import { ItemsListComponent } from '../../components/items-list/items-list.component';

@Component({
  selector: 'ec-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ItemsListComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent implements OnInit {
  products$!: Observable<IProductResponse[]>;

  constructor(
    public searchService: SearchService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.products$ = this.searchService.searchTerm$.pipe(
      switchMap((searchTerm) => this.productsService.getProducts(searchTerm))
    );
  }
}
