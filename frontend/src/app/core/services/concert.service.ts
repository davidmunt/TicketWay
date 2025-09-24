import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Concert } from "../models";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class ConcertService {
  constructor(private apiService: ApiService) {}

  get_concerts(): Observable<Concert[]> {
    return this.apiService.get(`/concerts/`);
  }

  get_concert(slug: String): Observable<Concert> {
    return this.apiService.get(`/concerts/${slug}`);
  }
}
