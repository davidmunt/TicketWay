import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";
import { HttpParams } from "@angular/common/http";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  get_categories(offset?: number, limit?: number): Observable<Category[]> {
    let options: { params?: HttpParams } = {};
    if (offset !== undefined && limit !== undefined) {
      options.params = new HttpParams().set("offset", offset.toString()).set("limit", limit.toString());
    }
    return this.apiService.get(user_port, `/categories/`, options);
  }

  get_category(slug: String): Observable<Category> {
    return this.apiService.get(user_port, `/categories/${slug}`);
  }
}
