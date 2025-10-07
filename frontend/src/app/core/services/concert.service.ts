import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Concert, Filters } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";
import { HttpParams } from "@angular/common/http";

const user_port = environment.user_port;

let options: { params?: HttpParams } = {};

@Injectable({
  providedIn: "root",
})
export class ConcertService {
  constructor(private apiService: ApiService) {}

  get_concerts(offset?: number, limit?: number): Observable<Concert[]> {
    if (offset !== undefined && limit !== undefined) {
      options.params = new HttpParams().set("offset", offset.toString()).set("limit", limit.toString());
    }
    return this.apiService.get(user_port, `/concerts/`, options);
  }

  get_concert(slug: String): Observable<Concert> {
    return this.apiService.get(user_port, `/concerts/${slug}`);
  }

  get_concerts_by_category(slug: String): Observable<Concert[]> {
    // console.log(slug);
    return this.apiService.get(user_port, `/concerts/category/${slug}`);
  }

  find_concert_name(search: string): Observable<any> {
    return this.apiService.get(user_port, `/products?name=${search}`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  get_concerts_filter(filters: Filters): Observable<Concert[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      const value = (filters as any)[key];
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.apiService.get(user_port, `/concerts/`, { params });
  }
}
