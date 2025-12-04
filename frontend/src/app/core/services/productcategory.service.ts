import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { ProductCategory } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ProductCategoryService {
  private _productCategory = signal<ProductCategory | null>(null);
  productCategory = this._productCategory.asReadonly();
  constructor(private apiService: ApiService) {}

  get_product_category(productId: string): Observable<ProductCategory> {
    return this.apiService.get(user_port, `/productcategory/${productId}`).pipe(
      map((response: any) => {
        const mapped: ProductCategory = {
          id: response.id,
          slug: response.slug,
          name: response.name,
          description: response.description,
          image: response.image,
          isActive: response.isActive,
        };
        return mapped;
      }),
      tap((productCategory: ProductCategory) => {
        this._productCategory.set(productCategory);
      })
    );
  }
}
