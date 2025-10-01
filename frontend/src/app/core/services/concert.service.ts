import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Concert } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ConcertService {
  constructor(private apiService: ApiService) {}

  get_concerts(): Observable<Concert[]> {
    return this.apiService.get(user_port, `/concerts/`);
  }

  get_concert(slug: String): Observable<Concert> {
    return this.apiService.get(user_port, `/concerts/${slug}`);
  }

  get_concerts_by_category(slug: String): Observable<Concert[]> {
    return this.apiService.get(user_port, `/concerts/category/${slug}`);
  }
}
