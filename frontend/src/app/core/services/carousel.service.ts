import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CarouselDetails, CarouselHome } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class CarouselService {
  constructor(private apiService: ApiService) {}

  get_carousel_categories(): Observable<CarouselHome[]> {
    return this.apiService.get(user_port, `/carousel/`);
  }

  get_carousel_concert(slug: String): Observable<CarouselDetails> {
    return this.apiService.get(user_port, `/carousel/${slug}`);
  }
}
