import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { Product } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private _product = signal<Product | null>(null);
  product = this._product.asReadonly();
  constructor(private apiService: ApiService) {}

  get_product(productId: string): Observable<Product> {
    return this.apiService.get(user_port, `/product/${productId}`).pipe(
      map((response: any) => {
        const mapped: Product = {
          id: response.id,
          slug: response.slug,
          name: response.name,
          description: response.description,
          productCategory: response.productCategory,
          price: response.price,
          stockTotal: response.stockTotal,
          stockAvailable: response.stockAvailable,
          imageUrl: response.imageUrl,
          status: response.status,
          isActive: response.isActive,
        };
        return mapped;
      }),
      tap((product: Product) => {
        this._product.set(product);
      })
    );
  }
}
