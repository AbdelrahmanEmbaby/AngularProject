import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct, IProductResponse, IUpdateProduct } from '../interfaces/product.interface';
import { API_URL_TOKEN } from '../configs/tokens.config';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(
    @Inject(API_URL_TOKEN) private readonly api_url: string,
    private http: HttpClient
  ) {}

  createProduct(product: IProduct): Observable<IProductResponse> {
    return this.http.post<IProductResponse>(`${this.api_url}/products`, product);
  }

  updateProduct(id: number, product: IUpdateProduct): Observable<IProductResponse> {
    return this.http.put<IProductResponse>(
      `${this.api_url}/products/${id}`,
      product
    );
  }

  getProducts(
    search: string = '',
    discount: number = 0,
    page?: number,
    limit?: number
  ): Observable<IProductResponse[]> {
    let url = `${this.api_url}/products?discount_gte=${discount}`;

    if (page && limit) {
      url += `&_page=${page}&_limit=${limit}`;
    }

    return this.http.get<IProductResponse[]>(url).pipe(
      map((products) => {
        if (!search) return products;
        const searchLower = search.toLowerCase();
        return products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
        );
      })
    );
  }

  getProductById(id: string): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.api_url}/products/${id}`);
  }

  deleteProduct(id: number): Observable<IProductResponse> {
    return this.http.delete<IProductResponse>(`${this.api_url}/products/${id}`);
  }
}
