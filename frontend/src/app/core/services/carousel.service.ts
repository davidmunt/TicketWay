import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CarouselDetails, CarouselHome } from "../models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  get_categories(): Observable<CarouselHome[]> {
    return this.apiService.get(`/carousel/`);
  }

  get_category(slug: String): Observable<CarouselDetails> {
    return this.apiService.get(`/carousel/${slug}`);
  }
}
