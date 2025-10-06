import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Artist } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  constructor(private apiService: ApiService) {}

  get_artists(): Observable<Artist[]> {
    return this.apiService.get(user_port, `/artists/`);
  }

  get_artist(slug: String): Observable<Artist> {
    return this.apiService.get(user_port, `/artists/${slug}`);
  }
}
