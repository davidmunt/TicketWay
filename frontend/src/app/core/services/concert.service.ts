import { Injectable, signal } from "@angular/core";
import { Observable, map, tap } from "rxjs";
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
  private _concert = signal<Concert | null>(null);
  concert = this._concert.asReadonly();
  constructor(private apiService: ApiService) {}

  get_concerts(offset?: number, limit?: number): Observable<Concert[]> {
    if (offset !== undefined && limit !== undefined) {
      options.params = new HttpParams()
        .set("offset", offset.toString())
        .set("limit", limit.toString());
    }
    return this.apiService.get(user_port, `/concerts/`, options);
  }

  get_concert(slug: string): Observable<Concert> {
    return this.apiService
      .get(user_port, `/concerts/${slug}`)
      .pipe(tap((data: any) => this._concert.set(data)));
  }

  get_concerts_by_category(slug: String): Observable<Concert[]> {
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

  // favourite_concert(slug: String): Observable<Concert> {
  //   return this.apiService.post(user_port, `/concerts/favorite/${slug}`);
  // }

  // unfavourite_concert(slug: String): Observable<Concert> {
  //   return this.apiService.delete(user_port, `/concerts/favorite/${slug}`);
  // }

  favourite_concert(slug: string): Observable<{ isCompleted: boolean }> {
    return this.apiService.post(user_port, `/concerts/favorite/${slug}`).pipe(
      tap((res: any) => {
        if (res.isCompleted && this._concert()) {
          const current = this._concert()!;
          this._concert.set({
            ...current,
            favorited: true,
            favoritesCount: current.favoritesCount + 1,
          });
        }
      })
    );
  }

  unfavourite_concert(slug: string): Observable<{ isCompleted: boolean }> {
    return this.apiService.delete(user_port, `/concerts/favorite/${slug}`).pipe(
      tap((res: any) => {
        if (res.isCompleted && this._concert()) {
          const current = this._concert()!;
          this._concert.set({
            ...current,
            favorited: false,
            favoritesCount: current.favoritesCount - 1,
          });
        }
      })
    );
  }
}
