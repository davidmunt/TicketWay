import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CarouselDetails, CarouselHome } from "../models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class CarouselService {
  constructor(private apiService: ApiService) {}

  get_carousel_categories(): Observable<CarouselHome[]> {
    return this.apiService.get(`/carousel/`);
  }

  get_carousel_concert(slug: String): Observable<CarouselDetails> {
    return this.apiService.get(`/carousel/${slug}`);
  }
}
