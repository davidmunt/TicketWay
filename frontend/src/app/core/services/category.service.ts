import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  get_categories(offset?: number, limit?: number): Observable<Category[]> {
    if (offset !== undefined && limit !== undefined) {
      return this.apiService.get(`/categories?offset=${offset}&limit=${limit}`);
    }
    return this.apiService.get(`/categories/`);
  }

  get_category(slug: String): Observable<Category> {
    return this.apiService.get(`/categories/${slug}`);
  }
}
